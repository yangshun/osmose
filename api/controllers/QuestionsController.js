/**
 * QuestionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	// CRUD API
	index: function(req, res) {
		res.api.failure_code(404);
	},

	show: function(req, res) {
		var qid = req.param('id');
		Questions.getQuestionWithDetails(qid, {user: req.session.user_id}, function(err, question) {
			if (err || question === undefined) return res.api.failure(err);
			else res.api.success({'question': question});
		});
	},

  create: function(req, res) {
  	Questions.create(req.body, function(err, question) {
  		if (err || question === undefined) res.api.failure(err);
  		else {
  			Questions.getQuestionWithDetails(question.id, {user: req.session.user_id}, function(err, question){
	  			res.api.success({'question': question});
	  			Questions.publishCreate(question);
  			})
  		}
  	});
  },

  update: function(req, res) {
  	var id = req.param('id');
  	Questions.update(id, req.body, function(err, questions) {
  		if (err || questions === undefined) res.api.failure(err);
  		else {
  			Questions.getQuestionWithDetails(questions[0].id, {user: req.session.user_id}, function(err, question){
	  			res.api.success({'question': question});
	  			Questions.publishUpdate(question.id, question);
  			})
  		}
  	});
  },

	remove: function(req, res) {
		var qid = req.param('id');
		Questions.deleteQuestion(qid, function(err, question) {
			if (err || question === undefined) res.api.failure(err);
			else {
				res.api.success({'question': question});
				Questions.publishDestroy(req.param('id'));
			}
		});
	},

	// VIEW ROUTES
	details: function(req, res) {
		var qid = req.param('id');
		Questions.getQuestionWithDetails(qid, {user: req.session.user_id}, function(err, question) {
			if (err || question === undefined) return res.render(404);
			res.view({
				_layoutFile: '../layout.ejs',
				question: question,
				og_type: 'osmosetest:question'
			});
		});
	}
};
