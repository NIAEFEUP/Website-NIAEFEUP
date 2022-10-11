const keystone = require("keystone");
const FaseCandidatura = keystone.list("FaseCandidatura");
const RespostaCandidatura = keystone.list("RespostaCandidatura");
const PerguntaCandidatura = keystone.list("PerguntaCandidatura");
const Candidato = keystone.list("Candidato");

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	locals.candidato_id = req.params.id;

	// Load the candidate
	view.on("init", function (next) {
		Candidato.model.findById(req.params.id).exec(function (err, result) {
			if (err) {
				req.flash("error", "Ocorreu um erro, tenta mais tarde!");
				next(err);
			} else if (result) {
				locals.candidato = result;


				if (result.entrevistado) { // Já foi entrevistado

					RespostaCandidatura.model.find({ candidato: result._id })
						.exec(function (err, respostas) {
							if (err) {
								req.flash("error", "Ocorreu um erro, tenta mais tarde!");
								next(err);
							} else if (respostas.length === 0) {
								req.flash("error", "Ocorreu um erro. Esta entrevista não contém respostas");
								next(new Error("Ocorreu um erro. Esta entrevista não contém respostas"));
							} else {
								let perguntas_respostas = [];


								Promise.all(
									respostas.map(function (resposta) {
										return new Promise(function (resolve) {
											PerguntaCandidatura.model.findById(resposta.pergunta_candidatura)
												.exec(function (err, pergunta_candidatura) {
													if (err) {
														next(err);
														resolve();
													} else if (!pergunta_candidatura) {
														req.flash("error", "Ocorreu um Erro, não foi possivel obter pergunta com id: " + resposta.pergunta_candidatura);
														next(new Error("Ocorreu um Erro, não foi possivel obter pergunta com id: " + resposta.pergunta_candidatura));
														resolve();
													} else {

														perguntas_respostas.push({
															pergunta: pergunta_candidatura,
															resposta: resposta,
														});

													}


													resolve();

												});
										});
									}))
									.then(function () {
										locals.perguntas_respostas = perguntas_respostas;
										next();
									});


							}
						});

				} else {
					FaseCandidatura.model.findById(result.fase_candidatura)
						.exec(function (err, fase_candidatura) {
							if (err) {
								req.flash("error", "Ocorreu um Erro.");
								next(err);
							} else if (!fase_candidatura) {
								req.flash("error", "Ocorreu um Erro. A fase de Candidatura deste candidato não foi encontrada");
								next(err);
							} else {
								PerguntaCandidatura.model.find().where("fase_candidatura", fase_candidatura._id)
									.exec(function (err, perguntas) {
										if (err) {
											req.flash("error", "Ocorreu um Erro.");
											next(err);
										} else if (!perguntas) {
											req.flash("error", " Não foi possível obter as perguntas desta fase.");
											next(err);
										} else {
											locals.perguntas_candidatura = perguntas;
											next();
										}
									});
							}
						});

				}
			} else {
				req.flash("error", "Ocorreu um erro, tenta mais tarde!");
				next(new Error("Ocorreu um erro, tenta mais tarde!"));
			}
		});
	});

	// Render the view
	view.render("entrevista");
};


exports.create = function (req, res) {
	let info = req.body;
	info.data = new Date();

	let pergunta_key;
	let perguntas_respostas = [];
	for (pergunta_key in info) {
		if (info.hasOwnProperty(pergunta_key) && /pergunta-*/.test(pergunta_key) && info[pergunta_key]) {

			perguntas_respostas.push({
				pergunta_candidatura: pergunta_key.replace("pergunta-", ""),
				resposta: info[pergunta_key],
			});
		}
	}

	let cand_id = info.candidato_id;
	if (perguntas_respostas.length === 0) {
		req.flash("error", "Precisas de responder a pelo menos 1 pergunta!");
		res.redirect(`/entrevista/${cand_id}`);
		return;
	}

	Promise.all(
		perguntas_respostas.map(function (pergunta_resposta) {
			return new Promise(function (resolve, reject) {

				const resposta_details = {
					candidato: cand_id,
					...pergunta_resposta,
				};
				let resposta = RespostaCandidatura.model(resposta_details);
				resposta.save(function (err) {
					if (err) {
						if (err.name === "MongoError" && err.code === 11000) {
							reject("Esta entrevista já foi realizada!");
						} else {
							reject(err.name + "Ocorreu um erro, por favor tenta novamente!");
						}
					} else {
						resolve();
					}

				});
			});

		})
	)
		.then(function () {
			Candidato.model.update({ _id: cand_id }, { $set: { entrevistado: true } },
				function (err) {
					if (!err) {
						req.flash("success", "Entrevista realizada, Obrigado!");
					} else {
						req.flash("error", "Ocorreu um erro, tenta mais tarde!");
					}
				});

			res.redirect("/entrevistas");

		})
		.catch(function (err) {
			req.flash("error", err);
			res.redirect("/entrevistas");
		});


};

exports.delete = function (req, res) {

	Candidato.model.findById(req.params.id)
		.remove(function (err) {
			if (err) {
				req.flash("error", "Não foi possível encontrar o candidato.");
				res.redirect("/entrevistas");
			} else {
				req.flash("success", "A candidatura foi eliminada");
				res.redirect("/entrevistas");
			}
		});
};
