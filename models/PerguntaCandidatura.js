let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * PerguntaCandidatura Model
 * ==========
 */
let PerguntaCandidatura = new keystone.List('PerguntaCandidatura', {
	map: { name: 'pergunta' },
	label: 'Perguntas Candidaturas',
	path: 'perguntas-candidaturas',
	singular: 'Pergunta Candidatura',
	plural: 'Perguntas Candidaturas',

});

PerguntaCandidatura.add({
	pergunta: { type: Types.Text, required: true, initial: true, index: true },
	fase_candidatura: { type: Types.Relationship, ref: 'FaseCandidatura', required: true, initial: true },
});

/**
 * Relationships
 */
PerguntaCandidatura.relationship({ path: 'respostas', ref: 'RespostaCandidatura', refPath: 'pergunta_candidatura' });


/**
 * Registration
 */
PerguntaCandidatura.defaultColumns = 'pergunta, fase_candidatura';
PerguntaCandidatura.register();
