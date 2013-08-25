/**
 * CommentsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {

  },

  show: function(req, res) {

  },

  create: function(req, res) {

  },

  update: function(req, res) {

  },
  
	remove: function(req, res) {
		var aid = req.param('id');
		Comments.deleteComment(aid, function(err, result) {
			if (err) return res.send(404);
			res.send(result);
		})
	}

};
