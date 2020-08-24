let keystone = require("keystone");
let Types = keystone.Field.Types;

/**
 * Project Model
 * ==========
 */

let Project = new keystone.List("Project", {
	map: { name: "title" },
	autokey: { path: "slug", from: "title", unique: true },
});

let localStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "./public/images/projects/",
		publicPath: "/images/projects/",
	},
});

Project.add({
	title: { type: String, required: true },
	type: { type: Types.Select, options: "project, workshop, event", default: "project", index: true },
	state: { type: Types.Select, options: "planning, working, completed", default: "planning", index: true },
	responsible: { type: Types.Relationship, ref: "User", index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: "completed" } },
	image: {
		type: Types.File,
		storage: localStorage,
	},
	description: { type: Types.Textarea },
	link: { type: Types.Url },
});

Project.defaultColumns = "title, type, state, author, publishedDate";
Project.register();
