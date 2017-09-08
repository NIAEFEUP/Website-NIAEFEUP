var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    // Render the view
    view.render('profile');
};

/**
 * Update user profile
 */
exports.update = function(req, res) {
    User.model.findById(res.locals.user.id).exec(function(err, item) {

        if (err) {
            req.flash('warning', 'Database error!');
        }
        if (!item) {
            req.flash('warning', 'User not found!');
        }

        var formData = {
            avatar: req.body.avatar,
            name: { first: req.body.first, last: req.body.last },
            linkedin: req.body.linkedin,
            github: req.body.github,
            website: req.body.website,
            about: req.body.about
        }

        var data = (req.method == 'POST') ? formData : req.query;

        item.getUpdateHandler(req).process(data, {
            flashErrors: true,
        }, function(err) {
            if (err) {
                req.flash('warning', 'Error updating profile!');
                locals.validationErrors = err.errors;
            } else {
                req.flash('success', 'Your profile has been updated!');
                return res.redirect('/profile');
            }
            next();
        });

    });
}