let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Som Model
 * ==========
 */
let Som = new keystone.List('Som', {
	map: { name: 'som' },
	label: 'Som',
	path: 'som',
	singular: 'som',
	plural: 'sons',

});

Som.add({
	title: { type: Types.Text, required: true, initial: true, index: true }
});


/**
 * Registration
 */
Som.defaultColumns = 'title';
Som.register();
