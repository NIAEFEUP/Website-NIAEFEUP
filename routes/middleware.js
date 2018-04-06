/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Members', key: 'home', href: '/members' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Por favor faz o login antes de aceder a este conteúdo.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.requireAdmin = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Por favor faz o login antes de aceder a este conteúdo.');
		res.redirect('/');
	} else if (req.user.isAdmin) {
		next();
	} else {
		req.flash('warning', 'Precisas de ter permissões de administrador.');
		res.redirect('/');
	}
};

exports.nonUser = function (req, res, next) {
	if (req.user) {
		req.flash('error', 'Já és membro do NIAEFEUP!');
		res.redirect('/');
	} else {
		next();
	}
};

exports.nonRecruta = function (req, res, next) {

	if (!req.user) {
		res.redirect('/');
	} else if (req.user.position === 'Recruta') {
		req.flash('warning', 'Esta página é só para membros.');
		res.redirect('/');
	} else {
		next();
	}
};

// TODO fazer a validação do lado do servidor dos dados da candidatura
exports.validateApplication = function (req, res, next) {
	let currYear = req.body.ano_curricular;
	if (currYear >= 1) {
		next();
	} else {
		req.flash('warning', 'O Ano Curricular tem de ser positivo.');
		res.redirect('/candidatura');
	}

};

exports.User_Password = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Por favor faz o login antes de aceder a este conteúdo.');
		res.redirect('/keystone/signin');
	} else {
		if (req.body.password) {

			req.user._.password.compare(req.body.password, function (err, result) {
				if (result) {
					next();
				} else {
					req.flash('error', 'A password que inseriste está errada!');
					res.redirect('/profile');
				}
			});

		} else {
			req.flash('error', 'Preenche a tua password atual.');
			res.redirect('/profile');
		}
	}
};
