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
  }
};
