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
const ROUTE_PREFIX = process.env.ROUTE_PREFIX || "/";

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
	const router = keystone.createRouter();

	// Views
	router.get("/", routes.views.home);
	router.get("/signin", middleware.requireUser, routes.views.home);
	router.get("/profile", middleware.requireUser, routes.views.profile);
	router.post("/profile", middleware.User_Password, routes.views.profile.update);
	router.get("/members", routes.views.members);
	router.get("/member/:id", routes.views.member);
	router.get("/blog/:category?", routes.views.blog);
	router.get("/blog/post/:post", routes.views.post);

	router.get("/email", middleware.requirePresidency, routes.views.email);
	router.post("/email", middleware.requirePresidency, routes.views.email.send);


	router.get("/candidatura", middleware.nonUser, routes.views.candidatura);
	router.post("/candidatura", middleware.nonUser, middleware.validateApplication, routes.views.candidatura.create);


	router.get("/entrevistas", middleware.requireMember, routes.views.entrevistas);
	router.post("/entrevistas_accept", middleware.requirePresidency, routes.views.entrevistas.approve);
	router.post("/entrevistas/close", middleware.requirePresidency, routes.views.entrevistas.close);
	router.post("/entrevistas/notificar", middleware.requirePresidency, routes.views.entrevistas.notify);
	router.post("/entrevistas/rejeitar", middleware.requirePresidency, routes.views.entrevistas.reject);
	router.get("/entrevista/:id", middleware.requireMember, routes.views.entrevista);
	router.post("/entrevista", middleware.requireMember, routes.views.entrevista.create);
	router.post("/entrevista/delete/:id", middleware.requireBoard, routes.views.entrevista.delete);

	router.get("/portfolio", routes.views.projetos);

	// Photo Upload Routes
	router.post("/api/profile/photo/update", middleware.requireUser, keystone.middleware.api, routes.api.profilephoto.update);
	router.post("/api/profile/photo/remove", middleware.requireUser, keystone.middleware.api, routes.api.profilephoto.remove);

	app.use(ROUTE_PREFIX, router);
};
