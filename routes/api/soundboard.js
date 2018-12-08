const Sound = keystone.list('Som');

exports.get = function (req, res) {
  Sound.model.find().exec(function(err, item) {
    if (err)
      return res.apiError('database error', err);
    if (!item)
      return res.apiError('not found');

    res.apiResponse({
      sound: item,
    });
  });
};

const keystone = require('keystone');
const fs = require('fs');
const sharp = require('sharp');
const FileData = keystone.list('FileUpload');
const User = keystone.list('User');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);



exports.upload = function (req) {
    return new Promise((resolve, reject) =>{
        try {
            const item = await createSound(req);
            /* let file = req.files.file_upload.path;
            const { data, info } = await 
			.toBuffer({ resolveWithObject: true }); */

            req.files.file_upload.path = `public/sounds/${item._id}.mp3`;
            req.files.file_upload.extension = 'mp3';
            req.files.file_upload.mimetype = 'audio/mpeg';
            req.files.file_upload.size = info.size;

            await writeFile(req.files.file_upload.path, data);
            
            resolve(item);
            
        } catch (err) {
            reject(err);
        }
    });
}


/**
 * Create a Sound
 */
const createSound = (req) => {
	return new Promise((resolve, reject) => {
		const title = req.body.title;

		const item = new Som.model({
			title
		});

		item.getUpdateHandler(req).process(req.files, (err) => {
			if (err) return reject(err);

			item.save((err) => {
				if (err) return reject(err);
				resolve(item);
			});
		});
	});
};
