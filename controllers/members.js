var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var express = require('express');
var extend = require('xtend');
var forms = require('forms');
var stormpath = require('stormpath');
var client = new stormpath.Client();

var router = express.Router();
 
var collectFormErrors = require('express-stormpath/lib/helpers').collectFormErrors;

/* TESTING
Grupos:
direção : https://api.stormpath.com/v1/groups/5dd3fxA6icR2V6G1dIoRB3
membros: https://api.stormpath.com/v1/groups/5jYgpzJVqUAQtyZmMYKDyD
recrutas : https://api.stormpath.com/v1/groups/5vDGIOEzmRt82YUiPV3ygr

var dir_group_ref = 'https://api.stormpath.com/v1/groups/5dd3fxA6icR2V6G1dIoRB3';
var mem_group_ref = 'https://api.stormpath.com/v1/groups/5jYgpzJVqUAQtyZmMYKDyD';
var rec_group_ref = 'https://api.stormpath.com/v1/groups/5vDGIOEzmRt82YUiPV3ygr';

var stormpath = require('stormpath');
var client = new stormpath.Client();

client.getGroup(dir_group_ref, function (err,group){

  group.getAccounts({}, function (err, collection) {
      collection.each(function (account, next) {
          console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
          console.log(account);
          account.getCustomData(function(err,data){
            console.log(data);
          });
          next();
      });
  });
});
END_TESTING*/

/* GET Template listing. */
router.get('/', function(req, res) {
  res.render('members',{title: 'Members'});
});
 

module.exports = router;
