var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    // Render the view
    view.render('profile');
};

/**
 * Get User by ID
 */
exports.update = function(req, res) {
    User.model.findById(req.body.id).exec(function(err, item) {

        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');

        var data = (req.method == 'POST') ? req.body : req.query;

        item.getUpdateHandler(req).process(data, function(err) {

            if (err) return res.apiError('create error', err);

            res.apiResponse({
                user: item
            });

        });

    });

    res.render('profile');
}