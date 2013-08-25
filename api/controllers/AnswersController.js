/**
 * AnswersController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    res.api.failure();
  },

  show: function(req, res) {
    var aid = req.param('id');
    Answers.findOne(aid).done(function(err, answer) {
      if (err || answer === undefined) res.api.failure();
      else res.api.success({'answer': answer});
    });
  },

  create: function(req, res) {
    Answers.create(req.body, function(err, answer) {
      if (err || answer === undefined) res.api.failure();
      else res.api.success({'answer': answer});
    });
  },

  update: function(req, res) {
    var aid = req.param('id');
    Answers.update(aid, req.body, function(err, answers) {
      if (err || answers === undefined) res.api.failure();
      else res.api.success({'answer': answers[0]});
    });
  },

	remove: function(req, res) {
		var aid = req.param('id');
		Answers.deleteAnswer(aid, function(err, answer) {
			if (err) res.api.failure();
			else res.api.success({'answer': answer});
		});
	}

};
