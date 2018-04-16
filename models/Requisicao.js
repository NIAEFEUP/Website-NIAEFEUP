let keystone = require('keystone');
let Types = keystone.Field.Types;

/**
 * Requisicao Model
 * ==========
 */
let Requisicao = new keystone.List('Requisicao', {
	nocreate: true,
	noedit: true,
});

Requisicao.add({
    responsavel: {type: Types.Name, required: true},
    emprestado: {type: Types.Name, required: false},
    date: {type: Types.Datetime, default: Date.now},
    material: {type: String, required: true},
    devolvido: {type: Types.Boolean, default: false}
});

Requisicao.defaultColumns = 'responsavel, emprestado, date, material';
Requisicao.register();