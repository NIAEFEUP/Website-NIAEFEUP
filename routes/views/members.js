var keystone = require('keystone');
var User = keystone.list('User');

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

			locals.direcao = [6];
			locals.members = [];
			locals.recrutas = [];

			let result;

			for (result of results) {
				switch (result.position) {
					case 'Presidente':
						locals.direcao[0] = result;
						break;
					case 'Vice-Presidente e Gestor de Projetos':
						locals.direcao[1] = result;
						break;
					case 'Vice-Presidente e Gestor de Eventos':
						locals.direcao[2] = result;
						break;
					case 'Tesoureiro':
						locals.direcao[3] = result;
						break;
					case 'Secretário e Responsável pela Sala':
						locals.direcao[4] = result;
						break;
					case 'Responsável pela Imagem e Comunicação':
						locals.direcao[5] = result;
						break;
					case 'Membro':
						locals.members.push(result);
						break;
					case 'Recruta':
						locals.recrutas.push(result);
						break;
				}
			}

			next(err);
		});

	});

	// Render the view
	view.render('members');
};
