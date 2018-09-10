let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Candidato Model
 * ==========
 */
let Candidato = new keystone.List('Candidato', {
	nocreate: true,
	noedit: true,
});

Candidato.add({
	name: { type: Types.Name, required: true },
	numero_up: { type: Types.Number, required: true, unique: true },
	email: { type: Types.Email, required: true, unique: true },
	curso: { type: String, required: true },
	ano_curricular: { type: Types.Number, required: true },
	porque_ni: { type: String, label: 'Porque o ni?', required: true },
	linkedin: { type: Types.Url },
	github: { type: Types.Url },
	website: { type: Types.Url },
	tecnologias: { type: String },
	aceite: { type: Types.Boolean, default: false },
	fase_candidatura: { type: Types.Relationship, ref: 'FaseCandidatura' },
});

/**
 * Relationships
 */
Candidato.relationship({ path: 'respostas_candidatura', ref: 'RespostaCandidatura', refPath: 'candidato' });

/**
 * Registration
 */
Candidato.defaultColumns = 'name, email, porque_ni, entrevista';
Candidato.register();
