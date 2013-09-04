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
    if (req.body.user_id === undefined) {
      req.body.user_id = req.session.user.id;
    }
    
    Answers.create(req.body, function(err, answer) {
      if (err || answer === undefined) res.api.failure(err);
      else {
        Answers.getAnswerWithComments(answer.id, {user: req.session.user.id},function(err, answer) {
          res.api.success({'answer': answer});
          Answers.publishCreate(answer);

          var fbActionName = 'osmosetest:answer';
          var objectToLike = "htpp://" + "osmose.soedar.com:" + req.port + '/questions/' + answer.question_id;
          req.facebook.api( 'https://graph.facebook.com/me/'.concat(fbActionName),
                            'post',
                            { question: objectToLike,
                              privacy: {'value': 'SELF'} },
                            function(response) {
                            });
        })
      }
    });
  },

  update: function(req, res) {
    var aid = req.param('id');
    Answers.update(aid, req.body, function(err, answers) {
      if (err || answers === undefined) res.api.failure(err);
      else {
        Answers.getAnswerWithComments(answers[0].id, {user: req.session.user.id}, function(err, answer) {
          res.api.success({'answer': answer});
          Answers.publishUpdate(answer.id, answer);
        })
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
