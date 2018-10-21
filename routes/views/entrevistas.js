const keystone = require('keystone');
const Candidato = keystone.list('Candidato');
const User = keystone.list('User');
const FaseCandidatura = keystone.list('FaseCandidatura');
const nodemailer = require('nodemailer');
const https = require('https');
const getPermGroupValue = require('../../models/User').getPermGroupValue;
const PERMISSION_GROUP = require('../../models/User').PERMISSION_GROUP;

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	FaseCandidatura.model.findOne({ ativa: true })
		.exec(function (err, fase) {
			if (err) {
				req.flash('error', 'Ocorreu um erro. Por favor tente mais tarde.');
				res.redirect('/');
			} else if (!fase) {
				req.flash('error', 'Não existe nenhuma fase de candidatura ativa de momento!');
				res.redirect('/');
			} else {

				Candidato.model.find({ fase_candidatura: fase._id }, '_id name numero_up entrevistado aceite data_entrevista').sort('entrevistado -data_entrevista').exec(function (err, results) {


					if (err) {
						req.flash('error', 'Ocorreu um erro. Por favor tente mais tarde.');
						res.redirect('/');
					} else if (results.length !== 0) {


						locals.candidatos = results;
						view.render('entrevistas');
					} else {
						req.flash('warning', 'Ainda não há candidatos.');
						res.redirect('/');
					}

				});
			}

		});
};

exports.approve = function (req, res) {

	Candidato.model.find({ _id: { $in: req.body.selectedCandidates } }).exec(function (err, results) {


		let errorCount = 0;

		Promise.all(
			results.map(candidato => {
				return new Promise((resolve, reject) => {


					const password = Math.random().toString(36).substring(2);

					let novoMembro = new User.model({
						name: candidato.name,
						email: candidato.email,
						password: password,
						linkedin: candidato.linkedin,
						github: candidato.github,
						website: candidato.website,
						permissionGroupValue: getPermGroupValue(PERMISSION_GROUP.RECRUIT),
					});


					novoMembro.save(function (err) {
						if (err) {
							errorCount++;

						} else {

							Candidato.model.update(
								{ _id: candidato._id },
								{ $set:
									{ aceite: true },
								},
								function (err, affected, resp) {
									if (err) {
										errorCount++;
									} else {
										if (process.env.SLACK_INVITE
											&& process.env.GOOGLE_DRIVE_INVITE
											&& process.env.GOOGLE_GROUPS_INVITE
											&& process.env.GMAIL_ADDRESS
											&& process.env.GMAIL_PASS) {
											const url = 'https://slack.com/api/users.admin.invite?token=' + process.env.SLACK_INVITE + '&email=' + candidato.email;

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

											let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ', antes de mais Parabéns! Foste aceite no Núcleo de Informática, Bem Vindo/a!</p>';
											message += ' <p> Para aderires ao google groups, clica no link abaixo: </p>';
											message += ' <a href=' + process.env.GOOGLE_GROUPS_INVITE + '> Google Groups</a>';
											message += ' <p> Para aderires ao google drive, clica no link abaixo: </p>';
											message += ' <a href=' + process.env.GOOGLE_DRIVE_INVITE + '> Google Drive</a>';
											message += ' <p> Para acederes à tua conta de membro vai a <a href=\'https://ni.fe.up.pt/signin\'>https://ni.fe.up.pt/signin</a>.</p>';
											message += ' <p> O teu username é ' + candidato.email + ' e a palavra passe é ' + password + '. Recomendamos que modifiques a tua palavra passe o quanto antes!</p>';

											message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
											message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
											message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
											message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
											message += '</div>';

											let mailOptions = {
												from: process.env.GMAIL_ADDRESS,
												to: candidato.email,
												subject: 'Bem-vindo ao NIAEFEUP!',
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

						}

						resolve();
					});
				});
			})
		).then(() => {
			if (errorCount > 0) {
				if (errorCount < results.length) {
					req.flash('warning', 'Ocorreu um erro, ' + errorCount + ' dos ' + results.length + ' candidatos não foram aceites com sucesso');
					res.redirect('/entrevistas');
				} else {
					req.flash('error', 'Ocorreu um erro, os candidatos não foram aceites');
					res.redirect('/entrevistas');
				}
			} else {


				req.flash('success', results.length + ' candidatos foram aceites!');
				res.redirect('/entrevistas');
			}

		});


	});

};

exports.close = function (req, res) {

	FaseCandidatura.model.findOneAndUpdate({ ativa: true }, { $set: { ativa: false } }).exec(function (err, result) {

		if (err) {
			req.flash('error', 'Não existe nenhuma fase ativa');
			res.redirect('/');
		} else if (result) {
			Candidato.model.find({
				fase_candidatura: result._id,
				entrevistado: true,
				aceite: false,
			}).exec((err, results) => {
				let errorCount = 0;

				Promise.all(
					results.map(candidato => {
						return new Promise((resolve, reject) => {
							if (process.env.GMAIL_ADDRESS
								&& process.env.GMAIL_PASS) {

								let transporter = nodemailer.createTransport({
									service: 'Gmail',
									auth: {
										user: process.env.GMAIL_ADDRESS,
										pass: process.env.GMAIL_PASS,
									},
								});

								let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',</p>';
								message += ' <p> Antes de mais, agradecemos sinceramente o teu interesse em fazer parte do NIAEFEUP e pelo tempo dispendido na tua candidatura ao Núcleo. </p>';
								message += ' <p> Após discussão interna e análise tanto da tua entrevista como da tua candidatura, vimos, infelizmente, informar-te que não iremos avançar com o processo. </p>';
								message += ' <p> Ainda assim, teremos todo o gosto em ajudar-te com o que for necessário e em voltar a receber a tua candidatura numa futura fase de recrutamento. </p>';

								message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
								message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
								message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
								message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
								message += '</div>';

								let mailOptions = {
									from: process.env.GMAIL_ADDRESS,
									to: candidato.email,
									subject: 'Candidatura NIAEFEUP',
									html: message,
									attachments: [{
										filename: 'logo-niaefeup.png',
										path: 'https://ni.fe.up.pt/images/logo-niaefeup.png',
										cid: 'id_1234698',
									}],
								};

								transporter.sendMail(mailOptions, function (error, info) {
									if (error) {
										errorCount++;
										console.error(error);
									} else {
										console.log('Email sent: ' + info.response);
									}
								});


								resolve();
							}
						});
					})).then(() => {
						if (errorCount > 0) {
							if (errorCount < results.length) {
								req.flash('warning', 'Ocorreu um erro, ' + errorCount + ' dos ' + results.length + ' emails não foram enviados com sucesso');
								res.redirect('/entrevistas');
							} else {
								req.flash('error', 'Ocorreu um erro, nenhum email foi enviado com sucesso');
								res.redirect('/entrevistas');
							}
						} else {
							req.flash('success', results.length + ' emails foram enviados!');
							res.redirect('/');
						}

					});
			});
		}


	});

};

function getDate (date) {
	let dateResult = {
		year: date.getFullYear(),
	};

	let month = (date.getMonth() + 1).toString();
	dateResult.month = (month.length === 1) ? ('0' + month) : month;
	let day = date.getDate().toString();
	dateResult.day = (day.length === 1) ? ('0' + day) : day;
	let hour = date.getHours().toString();
	dateResult.hour = (hour.length === 1) ? ('0' + hour) : hour;
	let minute = date.getMinutes().toString();
	dateResult.minute = (minute.length === 1) ? ('0' + minute) : minute;
	return dateResult;
};

exports.notify = function (req, res) {

	FaseCandidatura.model.findOne({ ativa: true }).exec(function (err, result) {

		if (err) {
			req.flash('error', 'Não existe nenhuma fase ativa');
			res.redirect('/');
		} else if (result) {
			Candidato.model.find({
				fase_candidatura: result._id,
				data_entrevista: { $exists: true },
			}).exec((err, results) => {
				let errorCount = 0;


				Promise.all(
					results.map(candidato => {
						return new Promise((resolve, reject) => {
							if (process.env.GMAIL_ADDRESS
								&& process.env.GMAIL_PASS) {

								const interviewDate = getDate(candidato.data_entrevista);

								let transporter = nodemailer.createTransport({
									service: 'Gmail',
									auth: {
										user: process.env.GMAIL_ADDRESS,
										pass: process.env.GMAIL_PASS,
									},
								});

								let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',</p>';
								message += ' <p> Após verificarmos tanto a tua disponibilidade, como a dos membros para fazer a entrevista, marcámos a tua entrevista para: </p>';
								message += ' <p> <span style="font-size:22px; font-weight:bold">' + interviewDate.day + '-' + interviewDate.month + '-' + interviewDate.year + ' às ' + interviewDate.hour + ':' + interviewDate.minute + '</span></p>';
								message += ' <p> Por favor confirma a tua presença em resposta a este e-mail ou, se por algum motivo, não conseguires estar presente, avisa-nos na resposta. </p>';

								message += ' <p> Ficamos à tua espera na B315!. </p>';

								message += '<div style=\'float:left;\'><img src=\'cid:id_1234698\' alt=\'logo niaefeup\' title=\'logo\' style=\'display:block\' width=\'50\'></div><div style=\'padding-left:70px\'><h2>Núcleo de Informática da AEFEUP</h2>';
								message += '<p><a href=\'ni@aefeup.pt\'>ni@aefeup.pt</a></p>';
								message += '<p><a href=\'https://ni.fe.up.pt\'>Website</a> | <a href=\'https://www.facebook.com/NIAEFEUP\'>Facebook</a> | <a href=\'https://www.instagram.com/niaefeup/\'>Instagram</a></p>';
								message += '<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href=\'https://goo.gl/maps/aj2LBqFkwjx\'>Google Maps</a></p>';
								message += '</div>';

								let mailOptions = {
									from: process.env.GMAIL_ADDRESS,
									to: candidato.email,
									subject: 'Entrevista NIAEFEUP',
									html: message,
									attachments: [{
										filename: 'logo-niaefeup.png',
										path: 'https://ni.fe.up.pt/images/logo-niaefeup.png',
										cid: 'id_1234698',
									}],
								};

								transporter.sendMail(mailOptions, function (error, info) {
									if (error) {
										errorCount++;
										console.error(error);
									} else {
										console.log('Email sent: ' + info.response);
									}
								});


								resolve();
							}
						});
					})).then(() => {
						if (errorCount > 0) {
							if (errorCount < results.length) {
								req.flash('warning', 'Ocorreu um erro, ' + errorCount + ' dos ' + results.length + ' emails não foram enviados com sucesso');
								res.redirect('/entrevistas');
							} else {
								req.flash('error', 'Ocorreu um erro, nenhum email foi enviado com sucesso');
								res.redirect('/entrevistas');
							}
						} else {
							req.flash('success', results.length + ' emails foram enviados!');
							res.redirect('/');
						}

					});
			});
		}


	});

};

exports.reject = function (req, res) {
	Candidato.model.find({ _id: { $in: req.body.selectedCandidates } }).exec(function (err, results) {
		results.map(candidato => {
			console.log('Rejecting candidate ' + candidato.name.first + ' ' + candidato.name.last);
		});
	});
};
