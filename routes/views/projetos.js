var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

    // Set locals
	locals.section = 'projects';
	locals.filters = {
		project: req.params.project,
	};

    // Load projects
	view.on('init', function (next) {


		var q = keystone.list('Project').model.find().sort('-publishedDate');

		q.exec(function (err, results) {
			locals.projects = results;
			next(err);
		});

	});
    // Render the view
	view.render('projetos');
};
