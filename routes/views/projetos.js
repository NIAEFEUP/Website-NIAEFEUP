const keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	// Set locals
	locals.section = 'projects';
	locals.filters = {
		project: req.params.project,
	};

	// Load projects
	view.on('init', function (next) {
		let q = keystone.list('Project').model.find().sort('-publishedDate');

		q.exec(function (err, results) {
			locals.projects = results;
			next(err);
		});
	});
	// Render the view
	view.render('projetos');
};
