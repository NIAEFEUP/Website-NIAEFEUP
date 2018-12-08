let keystone = require('keystone');

const Sound = keystone.list('Som');

exports.get = function (req, res) {
  Sound.model.find().exec(function(err, item) {
    if (err)
      return res.apiError('database error', err);
    if (!item)
      return res.apiError('not found');

    res.apiResponse({
      sound: item,
    });
  });
};
