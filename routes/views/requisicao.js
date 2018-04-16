var keystone = require('keystone');
var Requisicao = keystone.list('Requisicao');

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);

	// Render the view
	view.render('requisicao');
};

exports.create = function (req, res, next) {
    let novaReq = new Requisicao.model(req.body);

    novaReq.save(function (err) {
        if (err) {
            req.flash('error', 'Ocorreu um erro, por favor tenta novamente!');
				res.redirect('/requisicao');
        } else {
            req.flash('success', 'Requisicao submetida, Obrigado!');
			res.redirect('/');
        }
        next();
    });
};