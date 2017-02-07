var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var express = require('express');
var extend = require('xtend');
var forms = require('forms');

var router = express.Router();
 
var collectFormErrors = require('express-stormpath/lib/helpers').collectFormErrors;

/* GET Template listing. */
router.get('/', function(req, res) {
  res.render('members',{title: 'Members'});
});
 

module.exports = router;
