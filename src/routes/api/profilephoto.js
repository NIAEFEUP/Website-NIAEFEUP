const keystone = require("keystone");
const fs = require("fs");
const sharp = require("sharp");
const FileData = keystone.list("FileUpload");
const User = keystone.list("User");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const cloudinary = require("cloudinary").v2;
const promisify = require("util").promisify;
const upload = promisify(cloudinary.uploader.upload);


const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

const getUserPhotoModel = function (userId) {
	return new Promise((resolve, reject) => {
		FileData.model.find({ name: userId }).exec((err, items) => {
			if (err) return reject(err);
			if (!items || !items[0]) return resolve(null);
			resolve(items[0]);
		});
	});
};

const deleteFile = function (model) {
	return new Promise((resolve, reject) => {
		model.remove((err) => {
			if (err) return reject(new Error("database error"));

			// Resolve and delete the file asynchronously
			resolve(true);
			if(CLOUDINARY_URL){
				const { attributes1: cloudinary_id } = model;
				cloudinary.uploader.destroy(cloudinary_id);
			} else {
				const filePath = model.url;
				const full_path = process.cwd() + "/public" + filePath;
				fs.unlink(full_path, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Successfully deleted " + full_path);
					}
				});
			}
		});
	});
};

const removePhotoByUserId = function (userId) {
	return getUserPhotoModel(userId)
		.then((model) => {
			if (model) {
				deleteFile(model);
			}
		});
};

const cdnUpload = (data) => upload(`data:image/jpeg;base64,${data.toString("base64")}`);

const createPhoto = async function (req, data) {
	const item = new FileData.model();
	const userId = req.user._id;
	item.fileType = item.file.mimetype;
	item.createdTimeStamp = new Date();
	item.name = userId;
	if (CLOUDINARY_URL){
		const img = await cdnUpload(data);
		item.url = img.secure_url;
		item.attributes1 = img.public_id;
	} else {
		await writeFile(req.files.file_upload.path, data);
		const new_path = "/uploads/members/" + item.file.filename;
		item.url = new_path;
	}

	return item.save();
};

const updateUserPhoto = function (userId, photo) {
	return new Promise((resolve, reject) => {
		User.model.update({ _id: userId }, { $set: { photo_path: photo.url } }, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
};

/**
 * Update Profile Photo
 */
exports.update = async function (req, res) {
	try {
		const userId = req.user._id;

		if (req.files.file_upload.mimetype !== "image/jpeg" && req.files.file_upload.mimetype !== "image/png") {
			req.flash("warning", "File not supported");
			return res.apiResponse({ unsupported_file: true });
		} else if (req.files.file_upload.size > 5000000) {
			req.flash("warning", "Max file size is 5MB");
			return res.apiResponse({ unsupported_file: true });
		}

		// Resize and crop image
		let file = req.files.file_upload.path;
		const { data, info } = await sharp(file)
			.resize(700, 500)
			.crop(sharp.strategy.attention)
			.jpeg({ progressive: true, quality: 60 })
			.toBuffer({ resolveWithObject: true });

		req.files.file_upload.path = `${file}.jpg`;
		req.files.file_upload.extension = "jpg";
		req.files.file_upload.mimetype = "image/jpeg";
		req.files.file_upload.size = info.size;

		const oldPhoto = await getUserPhotoModel(userId);
		const newPhoto = await createPhoto(req, data);
		if (oldPhoto) {
			await deleteFile(oldPhoto);
		}
		await updateUserPhoto(userId, newPhoto);
		res.apiResponse({ success: true });
	} catch (err) {
		console.log(err);
		res.apiError("error");
	}
};

/**
 * Remove user photo
 */
exports.remove = function (req, res) {
	const userId = req.user._id;

	new Promise((resolve, reject) => {
		const photo_path = User.schema.paths.photo_path.defaultValue;
		User.model.update({ _id: userId }, { $set: { photo_path } }, (err) => {
			if (!err) resolve();
			else reject();
		});
	})
		.then(() => removePhotoByUserId(userId))
		.then(() => {
			req.flash("success", "Foto de perfil removida com sucesso!");
			return res.apiResponse({
				success: true,
			});
		})
		.catch(() => {
			req.flash("error", "Ocorreu um erro, tenta mais tarde!");
			return res.apiError("error");
		});
};


