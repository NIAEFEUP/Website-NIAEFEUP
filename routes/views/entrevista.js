const keystone = require('keystone');
const Entrevista = keystone.list('Entrevista');
const Candidato = keystone.list('Candidato');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	locals.candidato_id = req.params.id;

	// Load the current post
	view.on('init', function (next) {
		Candidato.model.findById(req.params.id).exec(function (err, results) {
			if (err) {
				req.flash('error', 'Ocorreu um erro, tenta mais tarde!');
				next(err);
			} else if (results) {
				locals.candidato = results;

				if (results.entrevista) { // Já foi entrevistado
					console.log('Foi entrevistado');

					Entrevista.model.find({ candidato_id: results._id }).exec(function (err, results) {
						if (err) {
							console.log(err);
							req.flash('error', 'Erro a pedir entrevista do candidato, tenta mais tarde!');
							req.redirect('/entrevistas');
						} else if (results) {
							locals.entrevista = results[0];
							next();
						}
					});
				} else {
					console.log('Não foi entrevistado');
					next();
				}
			} else {
				console.log('Erro');
				next();
			}
		});
	});

	// Render the view
	view.render('entrevista');
};


exports.create = function (req, res, next) {
	let info = req.body;
	info.data = new Date();
	let cand_id = info.candidato_id;

	let novaEntr = new Entrevista.model(info);

	novaEntr.save(function (err) {
		if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				req.flash('error', 'Esta entrevista já foi realizada!');
				res.redirect('/entrevistas');
			} else {
				req.flash('error', 'Ocorreu um erro, por favor tenta novamente!');
				res.redirect('/entrevistas');
			}
		} else {
			Candidato.model.update({ _id: cand_id }, { $set: { entrevista: true } },
				function (err, affected, resp) {
					if (!err) {
						req.flash('success', 'Entrevista realizada, Obrigado!');
					} else {
						req.flash('error', 'Ocorreu um erro, tenta mais tarde!');
					}
				});

			res.redirect('/entrevistas');
		}

		next();
	});
};
