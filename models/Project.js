var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Project Model
 * ==========
 */

var Project = new keystone.List('Project', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

var localStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: './public/images/projects/',
		publicPath: '/images/projects/',
	},
});

Project.add({
	title: { type: String, required: true },
	type: { type: Types.Select, options: 'project, workshop, event', default: 'project', index: true },
	state: { type: Types.Select, options: 'planning, working, completed', default: 'planning', index: true },
	responsible: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'completed' } },
	image: {
		type: Types.File,
		storage: localStorage,
	},
	description: { type: Types.Html, wysiwyg: true, height: 150 },
});

Project.defaultColumns = 'title, type, state, author, publishedDate';
Project.register();
