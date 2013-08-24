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
		Questions.getQuestionWithDetails(qid, function(err, question) {
			if (err || question === undefined) return res.send(404);
			res.send(question);
		});
	},

};
