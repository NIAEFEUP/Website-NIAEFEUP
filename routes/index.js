/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
const keystone = require("keystone");
const middleware = require("./middleware");
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre("routes", middleware.initLocals);
keystone.pre("render", middleware.flashMessages);

// Import Route Controllers
const routes = {
	views: importRoutes("./views"),
	api: importRoutes("./api"),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get("/", routes.views.home);
	app.get("/signin", middleware.requireUser, routes.views.home);
	app.get("/profile", middleware.requireUser, routes.views.profile);
	app.post("/profile", middleware.User_Password, routes.views.profile.update);
	app.get("/members", routes.views.members);
	app.get("/member/:id", routes.views.member);
	app.get("/blog/:category?", routes.views.blog);
	app.get("/blog/post/:post", routes.views.post);

	app.get("/email", middleware.requirePresidency, routes.views.email);
	app.post("/email", middleware.requirePresidency, routes.views.email.send);


	app.get("/candidatura", middleware.nonUser, routes.views.candidatura);
	app.post("/candidatura", middleware.nonUser, middleware.validateApplication, routes.views.candidatura.create);


	app.get("/entrevistas", middleware.requireMember, routes.views.entrevistas);
	app.post("/entrevistas_accept", middleware.requirePresidency, routes.views.entrevistas.approve);
	app.post("/entrevistas/close", middleware.requirePresidency, routes.views.entrevistas.close);
	app.post("/entrevistas/notificar", middleware.requirePresidency, routes.views.entrevistas.notify);
	app.post("/entrevistas/rejeitar", middleware.requirePresidency, routes.views.entrevistas.reject);
	app.get("/entrevista/:id", middleware.requireMember, routes.views.entrevista);
	app.post("/entrevista", middleware.requireMember, routes.views.entrevista.create);
	app.post("/entrevista/delete/:id", middleware.requireBoard, routes.views.entrevista.delete);

	app.get("/portfolio", routes.views.projetos);

	// Photo Upload Routes
	app.post("/api/profile/photo/update", middleware.requireUser, keystone.middleware.api, routes.api.profilephoto.update);
	app.post("/api/profile/photo/remove", middleware.requireUser, keystone.middleware.api, routes.api.profilephoto.remove);
};
