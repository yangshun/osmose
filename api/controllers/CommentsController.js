/**
 * CommentsController
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
  
	deletecomment: function(req, res) {
		var aid = req.param('commentid');
		Comments.deleteComment(aid, function(err, result) {
			if (err) return res.send(404);
			res.send(result);
		})
	}

};
