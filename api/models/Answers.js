/**
 * Answers
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	question_id: {
		type: 'INTEGER',
		required: true,
	},
	user_id: {
		type: 'INTEGER',
		required: true
	},
	content: {
		type: 'TEXT',
		notEmpty: true
	},
	deleted: {
		type: 'BOOLEAN',
		defaultsTo: false
	}
  },

  getAnswersWithComments: function(qid, cb) {
  	Answers.find({question_id: qid, deleted: false} , function(err, answers) {
  		if (err || answers === undefined) cb(err, undefined);
  		var next = function(err) {
  			// console.log(err)
  		}

      var result = [];

  		async.eachSeries(answers,
  			function(answer, next) {
	  			Answers.getAnswerWithComments(answer.id, function(err, details) {
	  				if (!err) result.push(details);
	  				next(err);
	  			});
  			},
  			function(err) {
  				cb(err, result);
  			});
	});
  },

  getAnswerWithComments: function(aid, cb) {
    Answers.findOne({id: aid, deleted: false}).done(function(err, answer) {
      if (err || answer === undefined) return cb(err, undefined);
      var next = function(err) {
        // console.log(err);
      };     

      async.parallel([
        function(next) {
          Votes.find({post_id: answer.id, post_type: 'ANSWER', deleted: false}).done(function(err, votes) {
            if (!err) {
              var score = 0;
              votes.forEach(function(vote) {
                score += vote.score;
              });
              answer.score = score;
            }
            next(err);
          });
        },
        function(next) {
          Comments.find({parent_id:answer.id, parent_type:'ANSWER', deleted: false}).done(function(err, comments) {
            if (!err) answer.comments = comments;
            next(err);
          });
        }],
        function(err) {
          cb(err, answer); 
        });
    });
  },
  
  deleteAnswer: function(aid, cb) {
  	this.update({id: aid},{deleted: true}).done(function(err, answer) {
  		if (err || answer === undefined) cb(err, undefined);

  		Comments.update({parent_id: aid, parent_type: 'ANSWER'}, {deleted: true}).done(function(err, comments) {
	  		if (err || comments === undefined) return cb(err, undefined);
	  		answer.comments = comments;
  			cb(null, answer);
  		});
  	});
  }

};
