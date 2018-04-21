let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * File Upload Model
 * ===========
 * A database model for uploading images to the local file system
 */

let FileUpload = new keystone.List('FileUpload');

let myStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./public/uploads/members'), // required; path where the files should be stored
		publicPath: '/public/uploads/members', // path where files will be served
	},
});

FileUpload.add({
	name: { type: String },
	file: {
		type: Types.File,
		storage: myStorage,
	},
	createdTimeStamp: { type: String },
	alt1: { type: String },
	attributes1: { type: String },
	category: { type: String }, // Used to categorize widgets.
	priorityId: { type: String }, // Used to prioritize display order.
	parent: { type: String },
	children: { type: String },
	url: { type: String },
	fileType: { type: String },

});


FileUpload.defaultColumns = 'name';
FileUpload.register();
