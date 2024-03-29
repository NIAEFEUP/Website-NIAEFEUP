// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require("dotenv").config();

// Require keystone
const keystone = require("keystone");

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	"name": "NIAEFEUP",
	"brand": "NIAEFEUP",
	"sass": "public",
	"static": "public",
	"favicon": "public/favicon.ico",
	"views": "templates/views",
	"view engine": "pug",
	"view cache": true,
	"emails": "templates/emails",
	"signin logo": ["../../images/favicon-96x96.png"],
	"signin redirect": "/",
	"signout redirect": "/",
	"signin url": "/signin",
	"signout url": "/",
	"auto update": true,
	"session": true,
	"session store": "mongo",
	"auth": true,
	"user model": "User",
	"mongo options": {
		
		keepAlive: 1,
		reconnectTries: 24 * 60, // 1 day at 60s intervals
		reconnectInterval: 60000,
	},
});

// Load your project's Models
keystone.import("models");

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set("locals", {
	_: require("lodash"),
	env: keystone.get("env"),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set("routes", require("./routes"));

// Configure the navigation bar in Keystone's Admin UI
keystone.set("nav", {
	users: "users",
	Candidaturas: ["FaseCandidatura", "PerguntaCandidatura", "Candidato", "RespostaCandidatura"],
});

if (!process.env.GMAIL_PASS || !process.env.GMAIL_ADDRESS) {
	console.warn("WARNING: You must define GMAIL_PASS and GMAIL_ADDRESS in the env file for the email notifier to work!");
}

if (!process.env.SLACK_INVITE || !process.env.GOOGLE_DRIVE_INVITE || !process.env.GOOGLE_GROUPS_INVITE) {
	console.warn("WARNING: You must define GOOGLE_GROUPS_INVITE, GOOGLE_DRIVE_INVITE and SLACK_INVITE in the env file for the accept candidate to work!");
}
keystone.start();
