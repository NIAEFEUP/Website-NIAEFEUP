let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
let User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	photo_path: { type: String, label: 'Photo path on server', default: '/images/members/default-profile.jpg' },
	linkedin: { type: Types.Url },
	github: { type: Types.Url },
	website: { type: Types.Url },
	about: { type: Types.Textarea },
	public: { type: Boolean, label: 'Is the profile public?', initial: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	permissionGroupValue: {
		type: Types.Select,
		numeric: true, 
		options: [
			{ value: 0, label: 'Admin' }, 
			{ value: 20, label: 'President' },
			{ value: 40, label: 'Board' },
			{ value: 60, label: 'Member' },
			{ value: 80, label: 'Recruit' }
		],
		initial: true,
		required: true,
	},
	position: {
		type: Types.Text,
		dependsOn: { permissionGroupValue: 40},
		initial: true,
		required: true,
	}
});


// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

// Get permissionGroup in {value, label} format
User.schema.virtual('permissionGroup').get(function () {
	let permissions = this.schema.path('permissionGroupValue').options.options;
	return permissions.find(perm => perm.value == this.permissionGroupValue);
				
});

// Get permissionGroup in {value, label} format
User.schema.virtual('positionLabel').get(function () {
	return this.position || this.permissionGroup.label;
				
});


/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, permissionGroupValue';
User.register();