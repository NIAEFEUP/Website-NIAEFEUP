let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Entrevista Model
 * ==========
 */
let Entrevista = new keystone.List('Entrevista', {
	noedit: true,
	nocreate: true,
});

Entrevista.add({
	candidato_id: { type: Types.Relationship, ref: 'Candidatura', required: true, initial: true, unique: true, index: true },
	entrevistador_1: { type: Types.Relationship, ref: 'User', required: true, initial: true },
	// entrevistador_2: {type: Types.Relationship, ref: 'User', required: true, initial: true},
	data: { type: Types.Date },
	estado_curso: { type: String, label: 'Estado do Curso?', required: true, initial: true },
	grupo_estudantil: { type: String, label: 'Integra ou pretende ingressar noutro grupo estudantil', required: true, initial: true },
	porque_ni: { type: String, label: 'Porque o ni?', required: true, initial: true },
	valor_acrescentado: { type: String, label: 'O que o candidato já fez que lhe acrescenta valor', required: true, initial: true },
	fazer_dentro_do_ni: { type: String, label: 'O que o candidato mais gostaria de fazer no ni', required: true, initial: true },
	erasmus: { type: Types.Boolean, required: true, initial: true },
	se_erasmus_futuro: { type: String, label: 'Se for de erasmus o que acha do futuro no ni' },
	se_5ano_futuro: { type: String, label: 'Se o candidato for do 5ano qual o seu futuro no curso' },
	observacoes: { type: String, label: 'Perguntas relacionadas com o curriculo do candidato' },
});

/**
 * Relationships
 */
// Entrevista.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
// Entrevista.defaultColumns = ', , porque_ni';
Entrevista.register();
