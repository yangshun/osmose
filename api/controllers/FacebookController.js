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
    req.facebook.api('/me/friends?fields=installed,name,username', function(err, data) {
        if (err) {
            res.api.failure(err);
        }
        else {
            installed = data.data.filter(function(friend) { return "installed" in friend });
            not_installed = data.data.filter(function(friend) { return !("installed" in friend)});

            res.api.success({'installed': installed, 'not_installed': not_installed});
        }
    });
  },
  
  ask_question: function(req, res) {
    var fbActionName = 'osmosetest:ask';
    var objectToLike = 'http://osmose.soedar.com/questions/' + req.param('id');
    console.log(objectToLike);
    req.facebook.api(
       'https://graph.facebook.com/me/'.concat(fbActionName),
       'post',
       { question: objectToLike,
         privacy: {'value': 'SELF'} },
       function(response) {
        res.send(response);
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
