var keystone = require('keystone');
var Entrevista = keystone.list('Entrevista');
var Candidatura = keystone.list('Candidatura');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'entrevista';
    locals.filters = {
        id: req.params.id,
    };

    // Load the current post
    view.on('init', function(next) {

        var cand = keystone.list('Candidatura').model.findById(req.params.id);
        locals.candidato_id = req.params.id;

        cand.exec(function(err, result) {

            if(!result){
              req.flash('error','Ocorreu um erro, tenta mais tarde!');
              next(err);
            }

            if(result.entrevista){//Já foi entrevistado

                var entre = keystone.list('Entrevista').model.findById(req.params.id);

                entre.exec(function(err, result) {
                    if(!result){
                      req.flash('error','Ocorreu um erro, tenta mais tarde!');
                      next(err);
                    } else {
                      locals.entrevista = result;
                      next();
                    }
                });
            }

            locals.candidato = result;
            next();
        });

    });

    // Render the view
    view.render('entrevista');
};


exports.create = function(req, res, next) {

  var info = req.body;
  info.data = new Date();
  var cand_id = info.candidato_id;

  //TODO ver o que falta aqui;
  console.log(info);

  var novaEntr = new Entrevista.model(info);

  novaEntr.save(function(err){
    if(err){

      if (err.name === 'MongoError' && err.code === 11000){

        req.flash('error', 'Esta entrevista já foi realizada!');
        res.redirect('/entrevistas');

      } else {

        req.flash('error', 'Ocorreu um erro, por favor tenta novamente!');
        res.redirect('/entrevistas');
      }

    } else {

      Candidatura.model.update({_id: cand_id}, {$set : {entrevista : true}},
        function(err, affected, resp) {
          if(!err){

              req.flash('success', 'Entrevista realizada, Obrigado!');

          } else {
            req.flash('error', 'Ocorreu um erro, tenta mais tarde!');
          }
        });

      res.redirect('/entrevistas');

    }

    next();
  });
}
