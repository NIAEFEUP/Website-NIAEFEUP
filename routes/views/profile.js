var keystone = require('keystone');

var User = keystone.list('User');
var FileData = keystone.list('FileUpload');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    FileData.model.find({ "name": res.locals.user.id }).exec(function(err, item) {

        if (err) {
            req.flash('warning', 'Database error!');
        }
        if (!item) {
            req.flash('warning', 'User not found!');
        }

        if (item[0] == undefined) {
            locals.filePath = "/images/members/default-profile.jpg";
        } else {
            if (item[0].url == undefined) {
                locals.filePath = "/images/members/default-profile.jpg";
            } else {
                locals.filePath = item[0].url;
            }
        }

        // Render the view
        view.render('profile');
    });
};

/**
 * Update user profile
 */
exports.update = function(req, res, next) {
    User.model.findById(res.locals.user.id).exec(function(err, item) {

        if (err) {
            req.flash('warning', 'Database error!');
        }
        if (!item) {
            req.flash('warning', 'User not found!');
        }

        var publicProfile;

        if (req.body.public === "on") {
            publicProfile = true;
        } else {
            publicProfile = false;
        }

        if(req.body.new_password != req.body.confirm_new_password){
            req.flash('warning', 'password and confirmation password are not equal');
        }


        var formData = {
            avatar: req.body.avatar,
            name: { first: req.body.first, last: req.body.last },
            position: req.body.position,
            linkedin: req.body.linkedin,
            github: req.body.github,
            website: req.body.website,
            about: req.body.about,
            public: publicProfile,
            password: req.body.new_password
        }

        var data = (req.method == 'POST') ? formData : req.query;

        var can_submit = true;

        if(req.body.new_password != req.body.confirm_new_password){
            can_submit = false;
        }

        var equal = true;

        item._.password.compare(req.body.old_password,function(err, isMatch){
              if(!isMatch){
                equal = false;
                req.flash('warning','password is not equal');
              }else if(err){
                equal = false;
                req.flash('warning','some error');
              }
          });

        console.log(equal);

        if(can_submit == true && equal==true){
          item.getUpdateHandler(req).process(data, {
              flashErrors: true,
          }, function(err) {

              if (err) {
                  req.flash('warning', 'Error updating profile!');
                  res.locals.validationErrors = err.errors;
              } else {
                  req.flash('success', 'Your profile has been updated!');
                  return res.redirect('/profile');
              }
              next();
          });
        }else{
          next();
        }

    });
}
