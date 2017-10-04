var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Load all members
    view.on('init', function(next) {

        Candidatura.model.find({}, '_id name numero_up entrevista').sort('numero_up').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            } else {
              locals.candidatos = results;
            }

            next();
      });
    });

    // Render the view
    view.render('entrevistas');
};


exports.approve = function(req, res, next) {

    //TODO Passar os membros para User Recruta e enviar os dados para slack e etc por email
    console.log(req.body);
    res.redirect('/entrevistas');
    next();
}
