var async = require('async'),
    keystone = require('keystone');

var User = keystone.list('User');

/**
 * List Users
 */
exports.list = function(req, res) {
    User.model.find(function(err, items) {

        if (err) return res.apiError('database error', err);

        res.apiResponse({
            users: items
        });

    });
}

/**
 * Get User by ID
 */
exports.get = function(req, res) {
    User.model.findById(req.params.id).exec(function(err, item) {

        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');

        res.apiResponse({
            user: item
        });

    });
}


/**
 * Create a User
 */
exports.create = function(req, res) {

    var item = new User.model(),
        data = (req.method == 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

        if (err) return res.apiError('error', err);

        res.apiResponse({
            user: item
        });

    });
}

/**
 * Get User by ID
 */
exports.update = function(req, res) {
    User.model.findById(req.params.id).exec(function(err, item) {

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
}

/**
 * Delete User by ID
 */
exports.remove = function(req, res) {
    User.model.findById(req.params.id).exec(function(err, item) {

        if (err) return res.apiError('database error', err);
        if (!item) return res.apiError('not found');

        item.remove(function(err) {
            if (err) return res.apiError('database error', err);

            return res.apiResponse({
                success: true
            });
        });

    });
}