/**
 * CoursesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    return res.api.failure_code(404);
  },
  
  show: function(req, res) {
    var id = req.param('id');
    Courses.findOne({id: id, deleted: false}).done(function(err, course) {
      if (err || course == undefined) {
        return res.api.failure(err);
      }

      Questions.getQuestionsOfCourse(id, {user: req.session.user.id}, function(err, questions) {
        if (err || questions == undefined) {
          console.log('1' + err)
          return res.api.failure(err);
        }
        course.questions = questions;
        return res.api.success({'course': course});
      })
    });
  },

  create: function(req, res) {
    Courses.create(req.body).done(function(err, course) {
      if (err) {
        return res.api.failure(err);
      }
      return res.api.success({'course': course});
    });
  },

  update: function(req, res) {
    Courses.update({id: req.param('id')}, req.body).done(function(err, courses) {
      if (err || courses == undefined) {
        return res.api.failure(err);
      }
      return res.api.success({'course': courses[0]});
    });
  },

  remove: function(req, res) {
    Courses.destroy({id: req.param('id')}).done(function(err) {
      if (err) {
        return res.api.failure(err);
      }
      return res.api.success({});
    });
  }
};
