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
  		var or_clause = [];
  		for(answer in answers) {
  			or_clause.push({parent_id: answer.id});
  		}

  		Comments.find({where:{or: or_clause, parent_type: 'ANSWER'}})
  		.done(
  			function(err, comments) {
		  		answers = answers.map(function(answer){
  					// answer.comments = comments.filter(function(comment) {
  					// 	return comment.parent_id === answer.id;
  					// }); // filter
  					return answer;
  				}); // map
  				cb(answers);
  			}); // done
	});
  } // answersWithComments

};
