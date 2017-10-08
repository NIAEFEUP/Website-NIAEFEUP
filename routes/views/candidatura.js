var keystone = require('keystone');
var Candidatura = keystone.list('Candidatura');
var nodemailer = require('nodemailer');

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

      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASS
        }
      });

      var message =" Olá " +  req.body['name.first'] + " " + req.body['name.last'] + "\n Muito obrigado pelo teu interesse em fazeres parte do Núcleo de Informática. A tua candidatura será revista e esperamos contactar-te brevemente com mais informações!";

      var mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: req.body['email'],
        subject: 'Candidatura subemetida.',
        text: message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

      req.flash('success', 'Candidatura submetida, Obrigado!');
      res.redirect('/');

    }
    next();
  });
}
