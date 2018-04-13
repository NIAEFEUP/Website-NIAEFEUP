var keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	// Render the view
	view.render('requisicao');
};

exports.create = function (req, res, next) {

    next();
}