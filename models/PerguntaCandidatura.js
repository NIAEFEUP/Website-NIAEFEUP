let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * PerguntaCandidatura Model
 * ==========
 */
let PerguntaCandidatura = new keystone.List('PerguntaCandidatura', {
	nocreate: true,
	noedit: true,
});

PerguntaCandidatura.add({
	pergunta: { type: Types.Text, required: true },
	fase_candidatura: { type: Types.Relationship, ref: 'FaseCandidatura' },
});

/**
 * Relationships
 */
PerguntaCandidatura.relationship({ path: 'respostas', ref: 'RespostaCandidatura', refPath: 'pergunta_candidatura' });


/**
 * Registration
 */
PerguntaCandidatura.defaultColumns = 'name, email, porque_ni, entrevista';
PerguntaCandidatura.register();
