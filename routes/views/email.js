const keystone = require("keystone");
const Candidato = keystone.list("Candidato");
const FaseCandidatura = keystone.list("FaseCandidatura");
const email_wrapper = require("../utils/email_wrapper");

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	// Render the view
	view.render("email");
};

exports.send = function (req, res, next) {
	FaseCandidatura.model.findOne({ ativa: true }).exec((err, fase) => {
		if (err) {
			req.flash("error", "Não existe nenhuma fase ativa de momento");
			next(err);
		} else {

			Candidato.model.find({ aceite: false, rejeitado: false, fase_candidatura: fase._id }, "email").exec(function (err, items) {
				if (err) {
					req.flash("error", "Ocorreu um erro, tenta mais tarde!");
					next(err);
				} else if (items) {
					const emails_candidatos = items.map(item => item.email);

					const text = req.body.email_text.replace(/\r?\n/g, "<br />");

					// Why?
					const message = "<div>" + text + "</div>";
					let mailOptions = {
						from: process.env.GMAIL_ADDRESS,
						bcc: emails_candidatos,
						subject: req.body.email_subject,
						html: message,
					};

					email_wrapper.sendMail(mailOptions);
				}
			});
		}
	});

	req.flash("success", "Email enviado com sucesso");
	res.redirect("/");
};
