/**
 * QuestionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
	getall: function(req, res) {
		res.send('getall');
	},

	get: function(req, res) {
		var qid = req.param('questionid');
		Questions.findOne(qid).done(function(err, question) {
			Comments.find({parent_id: qid, parent_type: 'QUESTION'}).done(function(err, qcomments) {
				question.comments = qcomments;
				Answers.answersWithComments(qid, function(answers){
					question.answers = answers;
					console.log('Question found with question: ');
					console.log(question);
					res.send(question);
				});
			})
		});
	},

};
