const sharp = require('sharp');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const imagesPath = './public/uploads/members/';

const resizeImage = function (file) {
	return sharp(`${imagesPath}${file}`)
	.resize(700, 500)
	.crop(sharp.gravity.center)
	.jpeg({ progressive: true, quality: 60 })
	.toBuffer()
	.then((buffer) => {
		return writeFile(`${imagesPath}${file}`, buffer);
	});
};

exports.create = function (done) {
	const promise = Promise.resolve();
	fs.readdirSync(imagesPath).forEach(file => {
		if (file.toLowerCase().includes('.jpg') || file.toLowerCase().includes('.jpeg')) {
			promise
			.then(() => resizeImage(file))
			.catch((err) => {
				console.error(`Error on file "${file}" -`, err);
			});
		}
	});
	promise.then(done);
};
