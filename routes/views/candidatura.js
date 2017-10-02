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

      new keystone.Email({
        templateName: 'enquiry-notification.pug',
        transport: 'mailgun',
      }).send({
        name: req.body['name.first'],
        message:'ola, entao tudo bem?',
      },{
        to: req.body['email'],
        from: {
          name: 'NIAEFEUP',
          email: 'excited@samples.mailgun.org',
        },
        subject: 'Candidatura subemetida.',

      }, function (err, result) {
            if (err) {
              console.error('Mailgun test failed with error:\n', err);
            } else {
              console.log('Successfully sent Mailgun test with result:\n', result);
            }
      });

      req.flash('success', 'Candidatura submetida, Obrigado!');
      res.redirect('/');

    }
    next();
  });
}
