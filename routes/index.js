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

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    views: importRoutes('./views'),
    api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function(app) {
    // Views
    app.get('/', routes.views.home);
    app.get('/signin', middleware.requireUser, routes.views.home);
    app.get('/profile', middleware.requireUser, routes.views.profile);
    app.post('/profile', middleware.requireUser, routes.views.profile.update);
    app.get('/members', routes.views.members);
    app.get('/member/:id', routes.views.member);
    app.get('/blog/:category?', routes.views.blog);
    app.get('/blog/post/:post', routes.views.post);
    app.get('/candidatura',middleware.nonUser,routes.views.candidatura);
    app.post('/candidatura',middleware.validarCandidatura,routes.views.candidatura.create);
    app.get('/entrevistas',middleware.nonRecruta,routes.views.entrevistas);
    app.get('/entrevista/:id',middleware.nonRecruta,routes.views.entrevista);

    //File Upload Route
    app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
    app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
    app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update);
    app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
    app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);
    app.get('/api/fileupload/:id/removePreviousPhoto', keystone.middleware.api, routes.api.fileupload.removePreviousPhoto);


    // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
    // app.get('/protected', middleware.requireUser, routes.views.protected);

};
