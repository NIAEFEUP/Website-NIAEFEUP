var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Candidatura Model
 * ==========
 */
var Candidatura = new keystone.List('Candidatura', {
  nocreate : true,
  noedit : true
});

Candidatura.add({
    name: { type: Types.Name, required: true},
    numero_up: { type: Types.Number, required: true, unique : true},
    email: { type: Types.Email, required: true, unique: true},
    porque_ni: { type: String, label: 'Porque o ni?', required: true},
    linkedin: { type: Types.Url},
    github: { type: Types.Url},
    website: { type: Types.Url},
    tecnologias: { type: String},
    entrevista: {type: Types.Boolean, default: false},
    aceite: {type: Types.Boolean, default: false}
});

/**
 * Relationships
 */
//Candidatura.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */
Candidatura.defaultColumns = 'name, email, porque_ni, entrevista';
Candidatura.register();
