const keystone = require('keystone');
const Candidato = keystone.list('Candidato');
const nodemailer = require('nodemailer');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	// Render the view
	view.render('email');
};

exports.send = function (req, res, next) {
	Candidato.model.find({ aceite: false }, 'email').exec(function (err, items) {
		if (err) {
			req.flash('error', 'Ocorreu um erro, tenta mais tarde!');
			next(err);
		} else if (items) {
			if (process.env.GMAIL_ADDRESS && process.env.GMAIL_PASS) {
				let transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: process.env.GMAIL_ADDRESS,
						pass: process.env.GMAIL_PASS,
					},
				});

				let items_email = [];

				for (let i = 0; i < items.length; i++) {
					items_email.push(items[i].email);
				}

				let receivers = items_email.join(' , ');
				console.log(receivers);

				let text = req.body.email_text.replace(/\r?\n/g, '<br />');

				let message = '<div> ' + text + '</div>';

				// signature
				message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
				message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
				message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
				message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
				message += '</div>';

				let mailOptions = {
					from: process.env.GMAIL_ADDRESS,
					to: receivers,
					subject: req.body.email_subject,
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
		}
	});

	req.flash('success', 'Email enviado com sucesso');
	res.redirect('/');
};
