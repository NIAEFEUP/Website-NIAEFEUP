let keystone = require("keystone");
let Types = keystone.Field.Types;

/**
 * RespostaCandidatura Model
 * ==========
 */
let RespostaCandidatura = new keystone.List("RespostaCandidatura", {
	map: { name: "resposta" },
	label: "Respostas Candidatura",
	path: "respostas-candidatura",
	singular: "Resposta Candidatura",
	plural: "Respostas Candidatura",
});

RespostaCandidatura.add({
	resposta: { type: Types.Text, initial: true },
	pergunta_candidatura: { type: Types.Relationship, ref: "PerguntaCandidatura", required: true, initial: true, unique: false },
	candidato: { type: Types.Relationship, ref: "Candidato", required: true, initial: true, unique: false },
});


RespostaCandidatura.defaultColumns = "pergunta_candidatura, resposta, candidato";

// Ensuring that a candidate only answers once to each question
RespostaCandidatura.schema.index({ pergunta_candidatura: 1, candidato: 1 }, { unique: true });

/**
 * Registration
 */
RespostaCandidatura.register();
