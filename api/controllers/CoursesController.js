/**
 * CoursesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {

  },
  
  show: function(req, res) {
    var cid = req.param('id');
    Courses.findOne({id: cid, deleted: false}).done(function(err, course) {
      if (err || course === undefined) return res.send(404);
  	  Questions.getQuestionsOfCourse(req.param('id'), function(err, questions) {
  		  if (err || questions === undefined) return res.send(404);
  		  course.questions = questions;
        return res.send(course);
  	  });
    });
  },

  create: function(req, res) {

  },

  update: function(req, res) {

  },

  remove: function(req, res) {

  }
};
