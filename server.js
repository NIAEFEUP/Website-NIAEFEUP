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
  },
  web: {
    register: {
      enabled: false
    }
  }
}));

var controllers = require('./controllers');

app.use('/', controllers.home);
app.use('/members', controllers.members);
app.use('/profile',stormpath.authenticationRequired,controllers.profile);

app.on('stormpath.ready',function(){
  console.log('Stormpath Ready');
});
 
app.listen(3000);