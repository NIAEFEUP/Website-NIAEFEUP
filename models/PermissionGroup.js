let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * PermissionGroup Model
 * ==========
 */
let PermissionGroup = new keystone.List('PermissionGroup');

PermissionGroup.add({
	name: { type: Types.Name, required: true, index: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	position: {
		type: Types.Select,
		options: 'Admin, Membro, Recruta, Presidente, Vice-Presidente e Gestor de Projetos, Vice-Presidente e Gestor de Eventos, Tesoureiro, Secretário e Responsável pela Sala, Responsável pela Imagem e Comunicação',
		initial: true,
		required: true,
	},
	permissionGroup: {
		type: Types.Select,
		options: 'Admin, President, Board, Member, Recruit',
		initial: true,
		required: true,
	},
});

/**
 * Relationships
 */
PermissionGroup.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */
PermissionGroup.defaultColumns = 'name, email, isAdmin, permissionGroup';
PermissionGroup.register();
