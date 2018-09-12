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
	ativa: { type: Types.Boolean, default: false, initial: false },
});

/**
 * Relationships
 */
FaseCandidatura.relationship({ path: 'candidatos', ref: 'Candidato', refPath: 'fase_candidatura' });
FaseCandidatura.relationship({ path: 'perguntas', ref: 'PerguntaCandidatura', refPath: 'fase_candidatura' });


FaseCandidatura.schema.pre('validate', function (next) {
	if (this.data_inicio > this.data_fim) {
		next(new Error('A data de fim não pode ser anterior à de inicio'));
	} else {
		next();
	}
});

function noOverlap (next) {
	FaseCandidatura.model.find({
		$or: [
			{
				$and: [
					{ data_inicio: { $lt: this.data_inicio } },
					{ data_fim: { $gt: this.data_inicio } },
				],
			},
			{
				$and: [
					{ data_fim: { $gt: this.data_fim } },
					{ data_inicio: { $lt: this.data_fim } },
				],
			},
			{
				$and: [
					{ data_inicio: { $gt: this.data_inicio } },
					{ data_fim: { $lt: this.data_fim } },
				],
			},
		],
	})
	.exec(function (err, fases) {
		if (fases.length > 0) {
			next(new Error('Esta Fase tem dias sobrepostos a uma já existente'));
		} else {
			next();
		}

	});
}

function noMultipleActive (next) {
	FaseCandidatura.model.find({
		$and:
		[
				{ ativa: { $eq: true } },
				{ ativa: { $eq: this.ativa } },
		],

	})
	.exec(function (err, fases) {
		if (err) next(err);
		if (fases.length > 0) {
			next(new Error('Já existe uma fase ativa! Por favor termine a outra fase.'));
		} else {
			next();
		}

	});

}

// Phase Restrictions - Two Phases cannot overlap, and only one phase is active at a time
FaseCandidatura.schema.pre('save', noOverlap);
FaseCandidatura.schema.pre('save', noMultipleActive);

/**
 * Registration
 */
FaseCandidatura.defaultColumns = 'name data_inicio, data_fim, ativa';
FaseCandidatura.register();
