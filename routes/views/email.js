var keystone = require('keystone');
var Candidatura = keystone.list('Candidatura');
var nodemailer = require('nodemailer');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);

    // Render the view
    view.render('email');
};

exports.send = function(req, res, next){

  if(process.env.GMAIL_ADDRESS && process.env.GMAIL_PASS){
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASS
      }
    });

    var message =req.body['text'] ;

    // signature
    message += "<div style='float:left;'><img src='cid:id_1234698' alt='logo niaefeup' title='logo' style='display:block' width='50' height='80'></div><div style='padding-left:70px'><h2>Núcleo de Informática da AEFEUP</h2>";
    message += "<p><a href='ni@aefeup.pt'>ni@aefeup.pt</a></p>";
    message += "<p><a href='https://ni.fe.up.pt'>Website</a> | <a href='https://www.facebook.com/NIAEFEUP'>Facebook</a> | <a href='https://www.instagram.com/niaefeup/'>Instagram</a></p>";
    message += "<p> Sala B315, Rua Dr.Roberto Frias, s/n 4200-465 Porto Portugal | <a href='https://goo.gl/maps/aj2LBqFkwjx'>Google Maps</a></p>";
    message += "</div>";

    var mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: req.body['email'],
      subject: 'Candidatura submetida.',
      html: message,
      attachments: [{
        filename: 'logo-niaefeup.png',
        path: 'https://ni.fe.up.pt/images/logo-niaefeup.png',
        cid: 'id_1234698'
      }]
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  req.flash('success', 'Email enviado com sucesso');
  res.redirect('/');


}
