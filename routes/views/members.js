var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'members';
    locals.filters = {
        category: req.params.category,
    };

    // Load all members
    view.on('init', function(next) {

        User.model.find().sort('name.first').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.members = results;

            next(err);
        });

    });

    // Render the view
    view.render('members');
};
