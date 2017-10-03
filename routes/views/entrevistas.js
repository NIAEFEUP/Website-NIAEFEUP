var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');
var $  = require('jquery');
var dt = require( 'datatables.net' )();

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Load all members
    view.on('init', function(next) {

        Candidatura.model.find().sort('numero_up').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            } else {
              locals.candidatos = results;
            }

            next();
      });
    });

    $('#table_id').DataTable();

    // Render the view
    view.render('entrevistas');
};
