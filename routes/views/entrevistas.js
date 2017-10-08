var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');
const nodemailer = require('nodemailer');
const https = require('https');
//var $  = require('jquery');
//var dt = require('datatables.net')( window, $ );

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

    //$('#table_id').DataTable();

    // Render the view
    view.render('entrevistas');
};


exports.approve = function(req, res) {

  Candidatura.model.find({'_id': {$in:req.body['accept']}}).exec(function(err, results){

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

        var message = "<p> Olá " + results[i]['name']['first'] + " " + results[i]['name']['last'] + " </p>";
        message += " <p> Para aderires ao google groups, clica no link a baixo: </p>";
        message += " <a href=" + process.env.GOOGLE_GROUPS_INVITE + "> Google Groups</a>";
        message += " <p> Para aderires ao google drive, clica no link a baixo: </p>";
        message += " <a href=" + process.env.GOOGLE_DRIVE_INVITE + "> Google Drive</a>";

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
  });
    //TODO Passar os membros para User Recruta e enviar os dados para slack e etc por email
    //TODO se for apenas 1 entao accept não é uma array mas sim um valor (id do candidato)

    res.redirect('/entrevistas');
}
