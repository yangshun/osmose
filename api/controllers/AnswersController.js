/**
 * AnswersController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    res.api.failure_code(404);
  },

  show: function(req, res) {
    var aid = req.param('id');
    Answers.findOne(aid).done(function(err, answer) {
      if (err || answer === undefined) res.api.failure(err);
      else res.api.success({'answer': answer});
    });
  },

  create: function(req, res) {
    Answers.create(req.body, function(err, answer) {
      if (err || answer === undefined) res.api.failure(err);
      else {
        res.api.success({'answer': answer});
        Answers.publishCreate(answer);
      }
    });
  },

  update: function(req, res) {
    var aid = req.param('id');
    Answers.update(aid, req.body, function(err, answers) {
      if (err || answers === undefined) res.api.failure(err);
      else {
        res.api.success({'answer': answers[0]});
        Answers.publishUpdate(answers[0].id, answers[0]);
      }
    });
  },

	remove: function(req, res) {
		var aid = req.param('id');
		Answers.deleteAnswer(aid, function(err, answer) {
			if (err) res.api.failure(err);
			else {
        res.api.success({'answer': answer});
        Answers.publishDestory(req.param('id'));
      }
		});
	}

};
