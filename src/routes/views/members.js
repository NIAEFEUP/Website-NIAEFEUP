const keystone = require("keystone");
const User = keystone.list("User");
const getPermGroupValue = require("../../models/User").getPermGroupValue;
const PERMISSION_GROUP = require("../../models/User").PERMISSION_GROUP;

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = "members";
	locals.filters = {
		category: req.params.category,
	};

	// Load all members
	view.on("init", function (next) {

		User.model.find().sort("name.first").exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.direcao_presidencia = [];
			locals.direcao = [];
			locals.members = [];
			locals.recrutas = [];

			let result;

			for (result of results) {

				let permGroup = result.permissionGroup;

				if (permGroup.value === getPermGroupValue(PERMISSION_GROUP.ADMIN)) {
					continue;
				}

				if (permGroup.value <= getPermGroupValue(PERMISSION_GROUP.VICE_PRESIDENT)) {
					locals.direcao_presidencia.push(result);
				} else if (permGroup.value <= getPermGroupValue(PERMISSION_GROUP.BOARD)) {
					locals.direcao.push(result);
				} else if (permGroup.value <= getPermGroupValue(PERMISSION_GROUP.MEMBER)) {
					locals.members.push(result);
				} else {
					locals.recrutas.push(result);
				}
			}

			locals.direcao_presidencia.sort(
				(a, b) => {
					if (a.permissionGroupValue === b.permissionGroupValue) {
						return a.name - b.name;
					} else {
						return a.permissionGroupValue - b.permissionGroupValue;
					}
				});


			next(err);
		});
	});

	// Render the view
	view.render("members");
};
