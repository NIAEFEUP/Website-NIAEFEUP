'use strict';

module.exports = {
  home: require('./home'),
  members: require('./members'),
  profile: require('./profile')() //Needs the () after the function. Don't know why :(
};
