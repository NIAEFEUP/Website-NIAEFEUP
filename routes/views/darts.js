var keystone = require('keystone');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);

    view.on('init', function (next) {
        console.log('hey');
        next();
    });

    view.render('darts');
};