var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'entrevista';
    locals.filters = {
        id: req.params.id,
    };

    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('Candidatura').model.findById(req.params.id);

        q.exec(function(err, result) {
            locals.candidato = result;
            next(err);
        });

    });

    // Render the view
    view.render('entrevista');
};
