let keystone = require("keystone");
let Types = keystone.Field.Types;

/**
 * Banner Model
 * ==========
 */

let Banner = new keystone.List("Banner", {
	map: { name: "title" },
	autokey: { path: "slug", from: "title", unique: true },
});

let localStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: "./public/images/home/",
		publicPath: "/images/home/",
	},
});

Banner.add({
	title: { type: String, required: true },
	image: {
		type: Types.File,
		storage: localStorage,
	},
	description: { type: Types.Textarea },
	buttonText: { type: String },
	link: { type: Types.Url },
});

Banner.defaultColumns = "title, type, state, author, publishedDate";
Banner.register();
