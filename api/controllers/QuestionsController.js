/**
 * QuestionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	index: function(req, res) {
		res.send('index');
	},

	show: function(req, res) {
		var qid = req.param('id');
		Questions.getQuestionWithDetails(qid, function(err, question) {
			if (err || question === undefined) return res.send(404);
			res.send(question);
		});
	},

  create: function(req, res) {

  },

  update: function(req, res) {

  },

	remove: function(req, res) {
		var qid = req.param('id');
		Questions.deleteQuestion(qid, function(err, question) {
			if (err || question === undefined) return res.send(404);
			res.send(question);
		});
	}
};
