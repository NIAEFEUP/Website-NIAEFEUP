var keystone = require('keystone');
var User = keystone.list('User');

function getPermGroupValue(permGroupLabel) {
	let permissions = User.schema.path('permissionGroupValue').options.options;
	return permissions.find(perm => perm.label == permGroupLabel).value;
}

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'members';
	locals.filters = {
		category: req.params.category,
	};

	// Load all members
	view.on('init', function (next) {

		User.model.find().sort('name.first').exec(function (err, results) {

			
			if (err || !results.length) {
				return next(err);
			}

			locals.direcao = [];
			locals.members = [];
			locals.recrutas = [];

			let result;

			for (result of results) {

				let permGroup = result.permissionGroup;

				if(permGroup.value <= getPermGroupValue('Board')) {
					locals.direcao.push(result);
				} else if (permGroup.value == getPermGroupValue('Member')) {
					locals.members.push(result);
				} else {
					locals.recrutas.push(result);
				}
				
			}

			next(err);
		});

	});

	// Render the view
	view.render('members');
};
