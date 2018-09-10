let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * FaseCandidatura Model
 * ==========
 */
let FaseCandidatura = new keystone.List('FaseCandidatura', {
	nocreate: true,
	noedit: true,
});

FaseCandidatura.add({
	ano: { type: Types.Number, required: true },
	fase: { type: Types.Number, required: true, unique: true },
	data_inicio: { type: Types.Date, required: true, unique: true },
	data_fim: { type: Types.Date, required: true, unique: true },
	ativa: { type: Types.Boolean, required: true, default: false },
	pergunta_candidatura: { type: Types.Relationship, ref: 'PerguntaCandidatura', many: true },
});

/**
 * Relationships
 */
FaseCandidatura.relationship({ path: 'candidatos', ref: 'Candidato', refPath: 'fase_candidatura' });
FaseCandidatura.relationship({ path: 'perguntas', ref: 'PerguntaCandidatura', refPath: 'fase_candidatura' });

/**
 * Registration
 */
FaseCandidatura.defaultColumns = 'name, email, porque_ni, entrevista';
FaseCandidatura.register();
