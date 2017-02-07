var express = require('express');
var stormpath = require('express-stormpath');
var app = express();
 
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(stormpath.init(app, {
  application: {
    href: 'https://api.stormpath.com/v1/applications/1eLftwqkR68eqy2KglBN93'
  },
  expand: {
    customData: true
  }
}));

/*app.get('/', stormpath.getUser, function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
}); */

var home = require('./routes/home');
var members = require('./routes/members');


app.use('/', home);
app.use('/members',members);

app.on('stormpath.ready',function(){
  console.log('Stormpath Ready');
});
 
app.listen(3000);