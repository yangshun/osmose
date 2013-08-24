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

  answersWithComments: function(qid, cb) {
  	this.findByQuestion_id(qid, function(err, answers) {
  		if (err || answers === undefined) cb(err, undefined);
  		var next = function(err) {
  			// console.log(err)
  		}
  		async.eachSeries(answers,
  			function(answer, next) {
	  			Comments.find({parent_id:answer.id, parent_type:'ANSWER'}).done(function(err, comments) {
	  				if (!err) answer.comments = comments;
	  				next(err);
	  			});
  			},
  			function(err) {
  				cb(err, answers);
  			});
	});
  }

};
