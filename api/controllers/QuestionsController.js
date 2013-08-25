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
			if (err || question === undefined) return res.api.failure();
			else res.api.success({'question': question});
		});
	},

  create: function(req, res) {
  	Questions.create(req.body, function(err, question) {
  		if (err || question === undefined) res.api.failure();
  		else res.api.success({'question': question});
  	});
  },

  update: function(req, res) {
  	var id = req.param('id');
  	Questions.update(id, req.body, function(err, questions) {
  		if (err || questions === undefined) res.api.failure();
  		else res.api.success({'question': questions[0]});
  	});
  },

	remove: function(req, res) {
		var qid = req.param('id');
		Questions.deleteQuestion(qid, function(err, question) {
			if (err || question === undefined) res.api.failure();
			else res.api.success({'question': question});
		});
	}
};
