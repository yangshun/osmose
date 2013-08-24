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
  		var total = answers.length;
  		var check = function() {
			total--;
			if (total <= 0) {
				return cb(answers);
			}
  		}

  		answers.forEach(function(answer) {
  			Comments.find({parent_id:answer.id, parent_type:'ANSWER'}).done(function(err, comments) {
  				answer.comments = comments;
	  			check();
  			})
  		});
	});
  } // answersWithComments

};
