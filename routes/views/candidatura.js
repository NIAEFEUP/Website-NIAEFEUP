var keystone = require('keystone');
var Candidatura = keystone.list('Candidatura');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    // Render the view
    view.render('candidatura');
};


exports.create = function(req, res, next) {

  var novaCand = new Candidatura.model(req.body);

  novaCand.save(function(err){
    if(err){

      if (err.name === 'MongoError' && err.code === 11000){

        req.flash('error', 'Apenas te podes candidatar uma vez!');
        res.redirect('/');

      } else {

        req.flash('error', 'Ocorreu um erro, por favor tenta novamente!');
        res.redirect('/candidatura');
      }

    } else {

      //TODO enviar email
      req.flash('success', 'Candidatura submetida, Obrigado!');
      res.redirect('/');

    }

    next();
  });
}
