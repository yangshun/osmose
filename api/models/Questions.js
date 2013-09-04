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

  getQuestionsOfCourse: function(cid, options, cb) {
    Questions.find({course_id: cid, deleted: false}).done(function(err, questions) {
      if (err || questions === undefined) return cb(err,undefined);
      var next = function(err) {
        // console.log(err);
      };

      var result = [];

      async.eachSeries(questions,
        function(question, next) {
          Questions.getQuestionWithDetails(question.id, options, function(err, details) {
            if (!err) result.push(details);
            next(err);
          });
        },
        function(err) {
          cb(err, result); 
        });
    });
  },

  getQuestionWithDetails: function(qid, options, cb) {
    Questions.findOne({id: qid, deleted: false}).done(function(err, question) {
      if (err || question === undefined) return cb(err, undefined);
      var next = function(err) {
        // console.log(err);
      };     

      async.parallel([
        function(next) {
          question.voted = false;
          Votes.find({post_id: question.id, post_type: 'QUESTION', deleted: false}).done(function(err, votes) {
            if (!err) {
              var score = 0;
              var my_vote = 0;
              votes.forEach(function(vote) {
                score += vote.score;
                if (vote.voter_id == options.user) { console.log("HERE"); my_vote += vote.score; }
              });
              question.score = score;
              question.voted = my_vote;
              console.log(options);
            }
            next(err);
          });
        },
        function(next) {
          Comments.getComments({parent_id: question.id, parent_type: 'QUESTION', deleted: false}, function(err, comments) {
            if (!err) question.comments = comments;
            next(err);
          });
        },
        function(next) {
          Answers.getAnswersWithComments(question.id, options, function(err, answers){
            if (!err) question.answers = answers;
            next(err);
          });
        },
        function(next) {
          Users.findOne(question.user_id).done(function(err, user) {
            if (!err) question.user = user;
            next(err);
          });
        }],
        function(err) {
          cb(err, question); 
        });
    });
  },

  deleteQuestion: function(qid, options, cb) {
      this.update({id: qid},{deleted: true}).done(function(err, questions) {
      if (err || questions === undefined) return cb(err, undefined);
        var question = questions[0];
        console.log(question);
        var changed = [];
        async.parallel([
          function(next) {
            Comments.update({parent_id: question.id, parent_type: 'QUESTION'}, {deleted: true}).done(function(err, comments) {
              if (!err) question.comments = comments;
              next(err);
            });
          },
          function(next) {
            Answers.update({question_id: question.id}, {deleted: true}).done(function(err, answers) {
              if (err || answers === undefined) return cb(err, question);

              async.each(answers,
                function(answer, nextEach) {
                  Answers.deleteAnswer(answer.id, options, function(err, result) {
                    if (!err) changed.push(result);
                    nextEach();
                  })
                },
                function(err) {
                  question.answers = changed;
                  next();
                });
            });
          }
        ],
        function(err) {
          cb(err, question);
        });
      });
  }

};
