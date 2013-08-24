/**
 * AnswersController
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
	deleteanswer: function(req, res) {
		var aid = req.param('answerid');
		Answers.deleteAnswer(aid, function(err, result) {
			if (err) return res.send(404);
			res.send(result);
		})
	}

};
