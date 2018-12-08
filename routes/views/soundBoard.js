const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	let locals = res.locals;
	locals.arrayTest = [{ title: 'Hello', url: 'teste' }, { title: 'Hello2', url: 'teste2' }];
	view.render('soundBoard');
};
