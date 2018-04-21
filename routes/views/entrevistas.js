const keystone = require('keystone');
const Candidatura = keystone.list('Candidatura');
const User = keystone.list('User');
const nodemailer = require('nodemailer');
const https = require('https');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Load all members
	view.on('init', function (next) {

		Candidatura.model.find({}, '_id name numero_up entrevista aceite').sort('numero_up').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			} else if (results.length !== 0) {
				locals.candidatos = results;
			} else {
				req.flash('warning', 'Ainda não há candidatos.');
				res.redirect('/');
			}

			next();
		});
	});

	// $('#table_id').DataTable();

	// Render the view
	view.render('entrevistas');
};

exports.approve = function (req, res) {

	Candidatura.model.find({ _id: { $in: req.body.accept } }).exec(function (err, results) {

		const password = Math.random().toString(36).substring(7);

		if (process.env.SLACK_INVITE && process.env.GOOGLE_DRIVE_INVITE
			&& process.env.GOOGLE_GROUPS_INVITE && process.env.GMAIL_ADDRESS && process.env.GMAIL_PASS) {
			for (let i = 0; i < results.length; i++) {
				const url = 'https://slack.com/api/users.admin.invite?token=' + process.env.SLACK_INVITE + '&email=' + results[i].email; // mudar para o email da pessoa

				// send request for send slack invitation using slack Web API
				https.get(url, (resp) => {
					resp.on('data', (chunk) => { });
					resp.on('end', () => { });

				}).on('error', (err) => {
					console.log('Error: ' + err.message);
				});

				let transporter = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: process.env.GMAIL_ADDRESS,
						pass: process.env.GMAIL_PASS,
					},
				});

				let message = '<p> Olá ' + results[i].name.first + ' ' + results[i].name.last + ' antes de mais Parabéns! Foste aceite no Núcleo de Informática, Bem Vind@!</p>';
				message += ' <p> Para aderires ao google groups, clica no link a baixo: </p>';
				message += ' <a href=' + process.env.GOOGLE_GROUPS_INVITE + '> Google Groups</a>';
				message += ' <p> Para aderires ao google drive, clica no link a baixo: </p>';
				message += ' <a href=' + process.env.GOOGLE_DRIVE_INVITE + '> Google Drive</a>';
				message += ' <p> Para acederes à tua conta de membro vai a https://ni.fe.up.pt/signin . O teu username é ' + results[i].email + ' e a palavra passe é ' + password + '. Recomendámos que modifiques a tua palavra passe o quanto antes!</p>';

				message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\' height=\'80\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
				message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
				message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
				message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
				message += '</div>';

				let mailOptions = {
					from: process.env.GMAIL_ADDRESS, // TODO mudar para o email do NI
					to: results[i].email,
					subject: 'Convite para Google Groups e Google Drive',
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

		let result;

		for (result of results) {

			let novoMembro = new User.model({
				name: result.name,
				email: result.email,
				password: password,
				linkedin: result.linkedin,
				github: result.github,
				website: result.website,
				position: 'Recruta',
			});

			novoMembro.save(function (err) {
				if (err) {

					req.flash('error', 'Introdução de novo membro falhou!');
					res.redirect('/entrevistas');

				}
			});

			Candidatura.model.update({ _id: result._id }, { $set: { aceite: true } },
				function (err, affected, resp) {
					if (err) { console.log('Update da candidatura falhou.'); }
				});
		}

	});

	// TODO Passar os membros para User Recruta
	res.redirect('/entrevistas');
};
