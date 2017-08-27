var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'profile';
    locals.filters = {
        id: req.params.id,
    };
    locals.data = {
        users: [],
    };

    // Load the current post
    view.on('init', function(next) {

        q.exec(function(err, result) {
            locals.data.user = result;
            next(err);
        });

    });

    // Render the view
    view.render('user');
};