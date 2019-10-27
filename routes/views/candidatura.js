const keystone = require("keystone");

const Candidato = keystone.list("Candidato");
const User = keystone.list("User");
const FaseCandidatura = keystone.list("FaseCandidatura");
const email_wrapper = require("../utils/email_wrapper");


exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);

	FaseCandidatura.model.findOne(
		{ ativa: true },
	)
		.exec((err, fase_candidatura) => {
			if (fase_candidatura) {
				const data_atual = Date.now();

				if (new Date(fase_candidatura.data_inicio) <= new Date(data_atual) && new Date(fase_candidatura.data_fim) >= new Date(data_atual)) {
					res.locals.fase_candidatura = fase_candidatura;
					// Render the view
					view.render("candidatura");
				} else {
					req.flash("error", "Não existe nenhuma fase de candidatura ativa de momento!");
					res.redirect("/");
				}
			} else if (err) {
				req.flash("error", "Ocorreu um erro. Por favor tente mais tarde.");
				res.redirect("/");
			}
		});
};

exports.create = function (req, res) {
	User.model.findOne({ email: req.body.email }).exec((err, result) => {
		if (result) {
			req.flash("error", "Já existe um membro registado com esse email!");
			res.redirect("/candidatura");
		} else {
			const novaCand = new Candidato.model(req.body);

			Candidato.model.findOne({
				email: req.body.email,
				fase_candidatura: req.body.fase_candidatura,
			}).select("_id").lean()
				.then((exists) => {
					if (exists) {
						req.flash("error", "Apenas te podes candidatar uma vez!");
						res.redirect("/candidatura");
					} else {
						novaCand.save((err) => {
							if (err) {
								req.flash("error", "Ocorreu um erro, por favor tenta novamente!");
								res.redirect("/candidatura");
							} else {
								let message = `<p> Olá ${req.body["name.first"]} ${req.body["name.last"]}</p>`;
								message += "<p> Muito obrigado pelo teu interesse em fazeres parte do Núcleo de Informática. A tua candidatura será revista e esperamos contactar-te brevemente com mais informações!</p>";

								const mailOptions = {
									from: process.env.GMAIL_ADDRESS,
									to: req.body.email,
									subject: "[NIAEFEUP] Candidatura submetida",
									html: message,
								};

								email_wrapper.sendMail(mailOptions);

								req.flash("success", "Candidatura submetida, Obrigado!");
								res.redirect("/");
							}
						});
					}
				});
		}
	});
};
