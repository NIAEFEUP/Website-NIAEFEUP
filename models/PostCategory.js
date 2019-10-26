let keystone = require("keystone");

/**
 * PostCategory Model
 * ==================
 */

let PostCategory = new keystone.List("PostCategory", {
	autokey: { from: "name", path: "key", unique: true },
});

PostCategory.add({
	name: { type: String, required: true },
});

PostCategory.relationship({ ref: "Post", path: "posts", refPath: "categories" });

PostCategory.register();
