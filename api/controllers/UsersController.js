/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  me: function(req, res) {
  	req.facebook.api('/me', function(err, data) {
  		if (!err) {
        data.user_id = req.session.id;
        res.api.success(data);
      }
  		else res.api.failure(404);
  	});
  },

  profile: function(req, res) {
    var uid = req.param('id');
    Users.getUserProfile(uid, {}, function(err, user) {
      if (err || user === undefined) {
        return res.render(404);
      } 
      res.view({user: user,
        _layoutFile: '../layout.ejs'});
    });
  },

  subscribe: function(req, res) {
    // TODO: Subscribe to the correct courses and questions
    var path = req.param('path');
    var id = req.param('id');

    if (path !== 'questions') {
      Questions.subscribe(req.socket);
    }
    Courses.subscribe(req.socket);
    Answers.subscribe(req.socket);
    Comments.subscribe(req.socket);
    Votes.subscribe(req.socket);
  }

};
