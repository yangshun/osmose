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
    var cid = req.param('courseid');
    Courses.findOne({id: cid, deleted: false}).done(function(err, course) {
      if (err || course === undefined) return res.send(404);
  	  Questions.getQuestionsOfCourse(req.param('courseid'), function(err, questions) {
  		  if (err || questions === undefined) return res.send(404);
  		  course.questions = questions;
        return res.send(course);
  	  });
    });
  }
};
