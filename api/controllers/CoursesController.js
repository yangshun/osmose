/**
 * CoursesController
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
  
  get: function(req, res) {
  	return Questions.getQuestionsOfCourse(req.param('courseid'), function(err, questions) {
  		if (err || questions === undefined) return res.send(404);
  		res.send(questions);
  	})
  }
};
