const keystone = require('keystone');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	// Set locals
	locals.section = 'member';
	locals.filters = {
		id: req.params.id,
	};

	// Load the current post
	view.on('init', function (next) {
		let q = keystone.list('User').model.findById(req.params.id);

		q.exec(function (err, result) {
			locals.member = result;
			next(err);
		});
	});

	// Render the view
	view.render('member');
};
