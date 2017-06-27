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
*/
var dir_group_ref = 'https://api.stormpath.com/v1/groups/5dd3fxA6icR2V6G1dIoRB3';
var mem_group_ref = 'https://api.stormpath.com/v1/groups/5jYgpzJVqUAQtyZmMYKDyD';
var rec_group_ref = 'https://api.stormpath.com/v1/groups/5vDGIOEzmRt82YUiPV3ygr';

var stormpath = require('stormpath');
var client = new stormpath.Client();

/*
var query = {//You need this to expand the customData
    expand : 'customData'
};


client.getGroup(dir_group_ref, function (err,group){

  group.getAccounts(query, function (err, collection) {
      collection.each(function (account, next) {
          console.log('Found account for ' + account.givenName + ' (' + account.email + ')');
          console.log(account.customData.href);
          account.getCustomData(function (err,customData){
             console.log("Got custom Data for account " + account.givenName);
             console.log(customData);
          });
      });
  });
});
/*END_TESTING*/

client.getAccounts('https://api.stormpath.com/v1/groups/5dd3fxA6icR2V6G1dIoRB3/accounts',function(err,collection){
    console.log(collection);
});

/* GET Template listing. */
router.get('/', function(req, res) {

    //Variables to check if each call as returned
    var got_dir = null;
    var got_mem = null;
    var got_rec = null;

    //Placeholders for the array containing the accounts information
    var direcao = null;
    var membros = null;
    var recrutas = null;

    var query = {//You need this to expand the customData
        expand : 'customData'
    };

    //The next 3 function calls are async meaning the program will continue to run without blocking
    //Getting the members who belong to the 'management' group
    client.getGroup(dir_group_ref, function (err,group){
      group.getAccounts(query, function (err, collection) {
          got_dir = true;
          direcao = collection.items;
          complete();
      });
    });

    //Getting the members who belong to the 'members' group
    client.getGroup(mem_group_ref, function (err,group){
      group.getAccounts(query, function (err, collection) {
          got_mem = true;
          membros = collection.items;
          complete();
      });
    });

    //Getting the members who belong to the 'recruits' group
    client.getGroup(rec_group_ref, function (err,group){
      group.getAccounts(query, function (err, collection) {
          got_rec = true;
          recrutas = collection.items;
          complete();
      });
    });

    //This function manages if all three async calls have returned, if not it does not render the data until all async calls return
    function complete() {
        if(got_dir != null && got_mem != null && got_rec != null)
            res.render('members',{title : 'Members', direcao: direcao, membros : membros, recrutas : recrutas});
    };
});


module.exports = router;
