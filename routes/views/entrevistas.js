var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');
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

  for (var i = 0; i < req.length; i++) {
    var url = 'https://slack.com/api/users.admin.invite?token=' + process.env.SLACK_INVITE  + '&email=consordlbaw@gmail.com'; // mudar para o email da pessoa

    // send request for send slack invitation using slack Web API
    https.get(url,(resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          console.log(JSON.parse(data).explanation);
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });

      // send email with invites for google groups and google drive
    new keystone.Email({
      templateName: 'convite.pug',
      transport: 'mailgun',
    }).send({
      name: req.body['name.first'],
      surname: req.body['name.last'],
      link_google_groups: process.env.GOOGLE_GROUPS_INVITE,
      link_google_drive: process.env.GOOGLE_DRIVE_INVITE,
    },{
      to: 'pount@sapo.pt', //req.body['email']
      from: {
        name: 'NIAEFEUP',
        email: 'excited@samples.mailgun.org',
      },
      subject: 'Convite para Google Groups e Google Drive',

    }, function (err, result) {
      if (err) {
        console.error('Mailgun test failed with error:\n', err);
      } else {
        console.log('Successfully sent Mailgun test with result:\n', result);
      }
    });

  }
    //TODO Passar os membros para User Recruta e enviar os dados para slack e etc por email
    //TODO se for apenas 1 entao accept não é uma array mas sim um valor (id do candidato)
    console.log(req.body);
    res.redirect('/entrevistas');
}
