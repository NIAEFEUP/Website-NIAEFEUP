let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * RespostaCandidatura Model
 * ==========
 */
let RespostaCandidatura = new keystone.List('RespostaCandidatura', {
	nocreate: true,
	noedit: true,
});

RespostaCandidatura.add({
	resposta: { type: Types.Text, required: true },
	pergunta_candidatura: { type: Types.Relationship, ref: 'PerguntaCandidatura' },
	candidato: { type: Types.Relationship, ref: 'Candidato' },
});


/**
 * Registration
 */
RespostaCandidatura.defaultColumns = 'name, email, porque_ni, entrevista';
RespostaCandidatura.register();
