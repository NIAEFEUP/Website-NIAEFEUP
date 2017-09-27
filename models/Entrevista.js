var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Entrevista Model
 * ==========
 */
var Entrevista = new keystone.List('Entrevista');

Entrevista.add({
    candidato_id: { type: Types.String, required: true, unique: true, index: true },
    entrevistador: {type: Types.String, required: true}
    estado_curto: { type: String, label: 'Estado do Curso?', required: true},
    grupo_estudantil: { type: Types.String, label: 'Integra ou pretende ingressar noutro grupo estudantil?', required: true},
    porque_ni: { type: String, label: 'Porque o ni?', required: true},
    });

/**
 * Relationships
 */
//Entrevista.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Entrevista.defaultColumns = 'name, email, porque_ni';
Entrevista.register();
