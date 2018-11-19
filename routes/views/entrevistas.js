const keystone = require('keystone');
const Candidato = keystone.list('Candidato');
const User = keystone.list('User');
const FaseCandidatura = keystone.list('FaseCandidatura');
const email_wrapper = require('../utils/email_wrapper');
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

				Candidato.model.find({ fase_candidatura: fase._id }, '_id name numero_up entrevistado aceite rejeitado data_entrevista').sort('entrevistado -data_entrevista').exec(function (err, results) {


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

	if (req.body.selectedCandidates === undefined) {
		req.flash('error', 'Não foram selecionados candidatos para rejeitar');
		res.redirect('/entrevistas');
		return;
	}

	Candidato.model.find({ _id: { $in: req.body.selectedCandidates }, entrevistado: true }).exec(function (err, results) {

		if (results.length !== req.body.selectedCandidates.length) {
			req.flash('warning', 'Nem todos os candidatos selecionados puderam ser aceites. Necessitam de ser entrevistados primeiro!');
		}

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

											let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',<p>';
											message += ' <p>Antes de mais parabéns! Foste aceite no Núcleo de Informática, Bem vindo/a!</p>';
											message += ' <p> Para aderires ao google groups, clica no link abaixo: </p>';
											message += ' <a href=' + process.env.GOOGLE_GROUPS_INVITE + '> Google Groups</a>';
											message += ' <p> Para aderires ao google drive, clica no link abaixo: </p>';
											message += ' <a href=' + process.env.GOOGLE_DRIVE_INVITE + '> Google Drive</a>';
											message += ' <p> Para acederes à tua conta de membro vai a <a href=\'https://ni.fe.up.pt/signin\'>https://ni.fe.up.pt/signin</a>.</p>';
											message += ' <p> O teu username é ' + candidato.email + ' e a palavra passe é ' + password + '. Recomendamos que modifiques a tua palavra passe o quanto antes!</p>';

											message += ' <p>Esperamos ver-te em breve!</p>';

											let mailOptions = {
												from: process.env.GMAIL_ADDRESS,
												to: candidato.email,
												subject: 'Bem-vindo ao NIAEFEUP!',
												html: message,
											};

											email_wrapper.sendMail(mailOptions);
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


				if (results.length > 0) {
					req.flash('success', results.length + ' candidatos foram aceites!');
				}
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
				rejeitado: false,
			}).exec((err, results) => {
				let errorCount = 0;

				Promise.all(
					results.map(candidato => {
						return new Promise((resolve, reject) => {


							let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',</p>';
							message += ' <p> Antes de mais, agradecemos sinceramente o teu interesse em fazer parte do NIAEFEUP e pelo tempo dispendido na tua candidatura ao Núcleo. </p>';
							message += ' <p> Após discussão interna e análise tanto da tua entrevista como da tua candidatura, vimos, infelizmente, informar-te que não iremos avançar com o processo. </p>';
							message += ' <p> Ainda assim, teremos todo o gosto em ajudar-te com o que for necessário e em voltar a receber a tua candidatura numa futura fase de recrutamento. </p>';

							message += ' <p> Obrigado pelo teu interesse, </p>';

							let mailOptions = {
								from: process.env.GMAIL_ADDRESS,
								to: candidato.email,
								subject: '[NIAEFEUP] Candidatura',
								html: message,
							};

							email_wrapper.sendMail(mailOptions, function (error, _info) {
								if (error) {
									errorCount++;
								}
							});

							resolve();
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
				rejeitado: false,
				data_entrevista: { $exists: true },
			}).exec((err, results) => {
				let errorCount = 0;


				Promise.all(
					results.map(candidato => {
						return new Promise((resolve, reject) => {

							const interviewDate = getDate(candidato.data_entrevista);

							let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',</p>';
							message += ' <p> Após verificarmos tanto a tua disponibilidade, como a dos membros para fazer a entrevista, marcámos a tua entrevista para: </p>';
							message += ' <p> <span style="font-size:22px; font-weight:bold">' + interviewDate.day + '-' + interviewDate.month + '-' + interviewDate.year + ' às ' + interviewDate.hour + ':' + interviewDate.minute + '</span></p>';
							message += ' <p> Por favor confirma a tua presença ou avisa-nos, em resposta a este e-mail, se por algum motivo não conseguires estar presente. </p>';

							message += ' <p> Ficamos à tua espera na B315! </p>';

							let mailOptions = {
								from: process.env.GMAIL_ADDRESS,
								to: candidato.email,
								subject: 'Entrevista NIAEFEUP',
								html: message,
							};

							email_wrapper.sendMail(mailOptions, function (error, _info) {
								if (error) {
									errorCount++;
								}
							});


							resolve();
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
	let candidateIds = req.body.selectedCandidates;
	if (req.body.selectedCandidates === undefined) {
		req.flash('error', 'Não foram selecionados candidatos para rejeitar');
		res.redirect('/entrevistas');
	}
	if (!Array.isArray(candidateIds)) {
		candidateIds = [req.body.selectedCandidates];
	}

	let failedCandidates = [];

	Promise.all(
		candidateIds.map(idOfCandidate => {
			return new Promise((resolve, reject) => {
				Candidato.model.findOneAndUpdate({ _id: idOfCandidate, entrevistado: false }, { $set: { aceite: false, rejeitado: true } }).exec(function (err, candidato) {

					if (err || !candidato) {
						failedCandidates = [...failedCandidates, idOfCandidate];
					} else {

						let message = '<p> Olá ' + candidato.name.first + ' ' + candidato.name.last + ',</p>';
						message += ' <p> Infelizmente, este ano, devido a um número muito elevado de candidatos, foi necessário filtrar alguns candidatos, tendo por base a sua candidatura. </p>';
						message += ' <p> Deste modo, não iremos prosseguir com o teu processo de recrutamento. </p>';
						message += ' <p> No entanto, contamos contigo para uma futura fase de recrutamento! </p>';

						message += ' <p> Obrigado pelo teu interesse, </p>';

						let mailOptions = {
							from: process.env.GMAIL_ADDRESS,
							to: candidato.email,
							subject: '[NIAEFEUP] Candidatura',
							html: message,
						};

						email_wrapper.sendMail(mailOptions, (error, _info) => {
							if (error) {
								console.log('ERROR SENDING REJECT MAIL TO ' + candidato.name.first + ' ' + candidato.name.last);
								failedCandidates = [...failedCandidates, idOfCandidate];
							}
						});

					}

					resolve();

				});
			});
		})
	).then(() => {

		if (failedCandidates.length > 0) {
			let errMsg = 'Ocorreu um erro ao rejeitar candidatos: ';
			for (const id of failedCandidates) {
				errMsg += `${id}, `;
			}

			req.flash('error', errMsg);
		}

		res.redirect('/entrevistas');
	});
};
