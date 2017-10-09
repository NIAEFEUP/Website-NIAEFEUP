var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');
var User = keystone.list('User');
const nodemailer = require('nodemailer');
const https = require('https');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Load all members
    view.on('init', function(next) {

        Candidatura.model.find({}, '_id name numero_up entrevista aceite').sort('numero_up').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            } else if(results.length != 0) {
              locals.candidatos = results;
            } else {
              req.flash("warning","Ainda não há candidatos.");
              res.redirect("/");
            }

            next();
      });
    });

    //$('#table_id').DataTable();

    // Render the view
    view.render('entrevistas');
};


exports.approve = function(req, res) {

  Candidatura.model.find({'_id': {$in:req.body['accept']}}).exec(function(err, results){

    var password = Math.random().toString(36).substring(7);
    console.log(password);

    if (process.env.SLACK_INVITE && process.env.GOOGLE_DRIVE_INVITE && 
      process.env.GOOGLE_GROUPS_INVITE && process.env.GMAIL_ADDRESS && process.env.GMAIL_PASS){
      for (var i = 0; i < results.length; i++) {
        var url = 'https://slack.com/api/users.admin.invite?token=' + process.env.SLACK_INVITE  + '&email=' + results[i]['email']; // mudar para o email da pessoa

        // send request for send slack invitation using slack Web API
        https.get(url,(resp) => {
            let data = '';
            resp.on('data', (chunk) => {
              data += chunk;
            });

            resp.on('end', () => {
              console.log(data);
              }
            );

          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });

          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.GMAIL_ADDRESS,
              pass: process.env.GMAIL_PASS
            }
          });

          var message = "<p> Olá " + results[i]['name']['first'] + " " + results[i]['name']['last'] + " antes de mais Parabéns! Foste aceite no Núcleo de Informática, Bem Vind@!</p>";
          message += " <p> Para aderires ao google groups, clica no link a baixo: </p>";
          message += " <a href=" + process.env.GOOGLE_GROUPS_INVITE + "> Google Groups</a>";
          message += " <p> Para aderires ao google drive, clica no link a baixo: </p>";
          message += " <a href=" + process.env.GOOGLE_DRIVE_INVITE + "> Google Drive</a>";
          message += " <p> Para acederes à tua conta de membro vai a https://ni.fe.up.pt/signin . O teu username é " + results[i]['email'] + " e a palavra passe é " + password + ". Recomendámos que modifiques a tua palavra passe o quanto antes!</p>";

          var mailOptions = {
            from: process.env.GMAIL_ADDRESS, //TODO mudar para o email do NI
            to:results[i]['email'],
            subject: 'Convite para Google Groups e Google Drive',
            html: message
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    }

    for (result of results) {

      var novoMembro = new User.model({
        name : result.name,
        email : result.email,
        password : password,
        linkedin: result.linkedin,
        github: result.github,
        website: result.website,
        position: "Recruta"
      });

      novoMembro.save(function(err){
        if(err){
    
          req.flash('error', 'Introdução de novo membro falhou!');
          res.redirect('/entrevistas');
    
        }
      });

      Candidatura.model.update({_id: result._id}, {$set : {aceite : true}},
        function(err, affected, resp) {
          if(err)
            console.log("Update da candidatura falhou.");
      });
    }

  });

    //TODO Passar os membros para User Recruta
    res.redirect('/entrevistas');
}
