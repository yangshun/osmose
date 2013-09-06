/**
 * FacebookController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  feed: function(req, res) {
    // Check if there is any message in the post body
    if (req.body.message) {
        req.facebook.api('/me/feed', 'POST', req.body, function(err, data) {
            if (err) {
                res.api.failure(err);
            }
            else {
                res.api.success(data)
            }
        });
    }
  },

  friends: function(req, res) {
    if (req.session.fb_friends) {
      return res.api.success(req.session.fb_friends);
    }
    req.facebook.api('/me/friends?fields=installed,name,username', function(err, data) {
        if (err) {
            res.api.failure(err);
        }
        else {
            var installed = data.data.filter(function(friend) { return "installed" in friend });
            var not_installed = data.data.filter(function(friend) { return !("installed" in friend)});

            var data = {'installed': installed, 'not_installed': not_installed};
            req.session.fb_friends = data;
            res.api.success(data);
        }
    });
  },
  
  // ask_question: function(req, res) {
  //   var fbActionName = 'osmosetest:ask';
  //   var objectToLike = 'http://osmose.soedar.com/questions/' + req.param('id');
  //   console.log(objectToLike);
  //   req.facebook.api(
  //      'https://graph.facebook.com/me/'.concat(fbActionName),
  //      'post',
  //      { question: objectToLike,
  //        privacy: {'value': 'SELF'} },
  //      function(response) {
  //       res.send(response);
  //      });
  // },

  random_users: function(req, res) {

    var shuffleArray = function(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    }

    // Shitty, non scalable implementation
    Facebook_users.find().done(function(err, data) {
      if (err) {
        return res.api.failure(err);
      }
      shuffleArray(data);

      var count = (req.param('count')) ? req.param('count') : 10;
      data = data.slice(0, count);

      res.api.success(data.map(function(user) {
        return user.facebook_id;
      }));
    });

  },

  remove: function(req, res) {
    var fb_userid = req.params.fb_id;
    if (fb_userid != req.session.fb_id) {
      return res.api.failure_message('User to delete must be the current user');
    }

    user = req.session.user;
    fb_user = req.session.fb_user;
    req.session.destroy();

    fb_user.destroy(function(err) {
      if (err) {
        return res.api.failure(err);
      }

      user.facebook_id = -1;
      user.name = "";
      user.deleted = true;

      user.save(function(err) {
        if (err) {
          return res.api.failure(err);
        }
        return res.api.success({});
      });
    });

  }
};
