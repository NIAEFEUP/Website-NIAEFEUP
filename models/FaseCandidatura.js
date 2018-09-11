let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * FaseCandidatura Model
 * ==========
 */
let FaseCandidatura = new keystone.List('FaseCandidatura', {
	label: 'Fases Candidatura',
	singular: 'Fase Candidatura',
	plural: 'Fases Candidatura',
	path: 'fases-candidatura',
});

FaseCandidatura.add({
	name: { type: Types.Text,
		watch: 'data_inicio data_fim',
		value: function () {
			const inicio = new Date(this.data_inicio);
			const fim = new Date(this.data_fim);
			return inicio.toDateString() + ' - ' + fim.toDateString();
		},
		noedit: true,
		initial: false,
	},
	data_inicio: { type: Types.Date, required: true, unique: true, initial: true },
	data_fim: { type: Types.Date, required: true, unique: true, initial: true },
	ativa: { type: Types.Boolean, default: false },
});

/**
 * Relationships
 */
FaseCandidatura.relationship({ path: 'candidatos', ref: 'Candidato', refPath: 'fase_candidatura' });
FaseCandidatura.relationship({ path: 'perguntas', ref: 'PerguntaCandidatura', refPath: 'fase_candidatura' });


/**
 * Registration
 */
FaseCandidatura.defaultColumns = 'name data_inicio, data_fim, ativa';
FaseCandidatura.register();
