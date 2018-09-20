const keystone = require('keystone');
const Candidato = keystone.list('Candidato');
const User = keystone.list('User');
const FaseCandidatura = keystone.list('FaseCandidatura');
const nodemailer = require('nodemailer');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	FaseCandidatura.model.findOne(
		{ ativa: true }
		)
		.exec(function (err, fase_candidatura) {
			if (fase_candidatura) {
				res.locals.fase_candidatura = fase_candidatura;
				// Render the view
				view.render('candidatura');
			} else if (err) {
				req.flash('error', 'Ocorreu um erro. Por favor tente mais tarde.');
				res.redirect('/');
			} else {
				req.flash('error', 'Não existe nenhuma fase de candidatura ativa de momento!');
				res.redirect('/');
			}
		});


};

exports.create = function (req, res) {

	User.model.findOne({ email: req.body.email }).exec((err, result) => {
		if (result) {
			req.flash('error', 'Já existe um membro registado com esse email!');
			res.redirect('/candidatura');
		} else {
			let novaCand = new Candidato.model(req.body);

			novaCand.save(function (err) {
				if (err) {
					if (err.name === 'MongoError' && err.code === 11000) {
						req.flash('error', 'Apenas te podes candidatar uma vez!');

						res.redirect('/candidatura');
					} else {
						req.flash('error', 'Ocorreu um erro, por favor tenta novamente!');
						res.redirect('/candidatura');
					}
				} else {
					if (process.env.GMAIL_ADDRESS && process.env.GMAIL_PASS) {
						let transporter = nodemailer.createTransport({
							service: 'Gmail',
							auth: {
								user: process.env.GMAIL_ADDRESS,
								pass: process.env.GMAIL_PASS,
							},
						});

						let message = '<p> Olá ' + req.body['name.first'] + ' ' + req.body['name.last'] + '</p>';
						message += '<p> Muito obrigado pelo teu interesse em fazeres parte do Núcleo de Informática. A tua candidatura será revista e esperamos contactar-te brevemente com mais informações!</p>';

						message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\' height=\'80\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
						message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
						message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
						message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
						message += '</div>';

						let mailOptions = {
							from: process.env.GMAIL_ADDRESS,
							to: req.body.email,
							subject: 'Candidatura submetida.',
							html: message,
							attachments: [{
								filename: 'logo-niaefeup.png',
								path: 'https://ni.fe.up.pt/images/logo-niaefeup.png',
								cid: 'id_1234698',
							}],
						};

						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});
					}

					req.flash('success', 'Candidatura submetida, Obrigado!');
					res.redirect('/');
				}
			});
		} });
};
