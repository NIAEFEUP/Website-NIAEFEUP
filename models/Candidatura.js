var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Candidatura Model
 * ==========
 */
var Candidatura = new keystone.List('Candidatura');

Candidatura.add({
    name: { type: Types.Name, required: true, index: true },
    numero_up: { type: Types.Number, initial: true, required: true},
    email: { type: Types.Email, initial: true, required: true, unique: true, index: true},
    porque_ni: { type: String, label: 'Porque o ni?', required: true, initial: true},
    linkedin: { type: Types.Url},
    github: { type: Types.Url},
    website: { type: Types.Url},
    tecnologias: { type: String}
});

/**
 * Relationships
 */
//Candidatura.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
Candidatura.defaultColumns = 'name, email, porque_ni';
Candidatura.register();
