var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Load all members
    view.on('init', function(next) {

        Candidatura.model.find().sort('numero_up').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            } else {
              console.log(results);
              locals.candidatos = results;
            }
      });

    });

    // Render the view
    view.render('entrevistas');
};
