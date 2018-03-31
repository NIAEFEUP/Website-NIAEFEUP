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

Project.add({
	title: { type: String, required: true },
	type: { type: Types.Select, options: 'project, workshop, event', default: 'project', index: true },
	state: { type: Types.Select, options: 'planning, working, completed', default: 'planning', index: true },
	responsible: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'completed' } },
	image_path: { type: String, label: 'Image path on disk', default: '/images/projects/default_project.jpg' },
	description: { type: Types.Html, wysiwyg: true, height: 150 },
});

Project.defaultColumns = 'title, type, state, author, publishedDate';
Project.register();
