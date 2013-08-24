/**
 * Question
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	user_id: {
  		type: 'INTEGER',
  		required: true
  	},
  	title: {
  		type: 'TEXT',
  		required: true,
  		notEmpty: true
  	},
  	content: 'TEXT',
  	course_id: {
  		type: 'INTEGER',
  		required: true
  	},
  	deleted: {
  		type: 'BOOLEAN',
  		defaultsTo: false
  	}
  },

  getQuestionsOfCourse: function(cid, cb) {
    Questions.find({course_id: cid}).done(function(err, questions) {
      if (err || question === undefined) return cb(err,undefined);
      var next = function(err) {
        // console.log(err);
      };

      var result = [];

      async.eachSeries(questions,
        function(question, next) {
          Questions.getQuestionWithDetails(question.id, function(err, details) {
            result.push(details);
            next();
          });
        },
        function(err) {
          cb(err, result); 
        });
    });
  },

 getQuestionWithDetails: function(qid, cb) {
    this.findOne(qid).done(function(err, question) {
      if (err || question === undefined) return cb(err, undefined);
      var next = function(err) {
        // console.log(err);
      };     

      async.parallel([
        function(next) {
          Comments.find({parent_id: question.id, parent_type: 'QUESTION'}).done(function(err, comments) {
            if (!err) question.comments = comments;
            next(err);
          });
        },
        function(next) {
          Answers.answersWithComments(question.id, function(err, answers){
            if (!err) question.answers = answers;
            next(err);
          });
        }],
        function(err) {
          cb(err, question); 
        });
    });
  }

};
