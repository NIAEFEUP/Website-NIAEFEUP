var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Entrevista Model
 * ==========
 */
var Entrevista = new keystone.List('Entrevista', {
  noedit : true,
  nocreate : true
});

Entrevista.add({
    candidato_id: { type: Types.Relationship, ref: 'Candidatura', required: true, unique: true, index: true },
    entrevistadores: {type: Types.Relationship, ref: 'User', many: true, required: true},
    data: {type: Types.Date},
    estado_curso: { type: String, label: 'Estado do Curso?', required: true},
    grupo_estudantil: { type: String, label: 'Integra ou pretende ingressar noutro grupo estudantil?', required: true},
    porque_ni: { type: String, label: 'Porque o ni?', required: true}
    });

/**
 * Relationships
 */
//Entrevista.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
//Entrevista.defaultColumns = ', , porque_ni';
Entrevista.register();
