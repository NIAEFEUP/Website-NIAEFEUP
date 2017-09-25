var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'members';
    locals.filters = {
        category: req.params.category,
    };

    // Load all members
    view.on('init', function(next) {

        User.model.find().sort('name.first').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.members = [];
            locals.recrutas = [];

            for (result of results) {
                switch(result.position){
                    case "Presidente":
                        locals.presidente = result;
                    break;
                    case "Vice-Presidente e Gestor de Projetos":
                        locals.gestor_projetos = result;
                    break;
                    case "Vice-Presidente e Gestor de Eventos":
                        locals.gestor_eventos = result;
                    break;
                    case "Tesoureiro":
                        locals.tesoureiro = result;
                    break;
                    case "Secretário e Responsável pela Sala":
                        locals.responsavel_sala = result;
                    break;
                    case "Responsável pela Imagem e Comunicação":
                        locals.imagem_comunicacao = result;
                    break;
                    case "Membro":
                        locals.members.push(result);
                    break;
                    case "Recruta":
                        locals.recrutas.push(result);
                    break;
                }
            }

            next(err);
        });

    });

    // Render the view
    view.render('members');
};
