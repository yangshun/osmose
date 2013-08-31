/**
 * CoursesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    // Might want to return list of courses that this user attends
    // When we add the users-courses model in the future
    var user_id = req.session.user.id;
    return res.api.failure(404);
  },
  
  show: function(req, res) {
    var id = req.param('id');

    Courses.subscribe(req.socket);
    Questions.subscribe(req.socket);
    Answers.subscribe(req.socket);
    Comments.subscribe(req.socket);
    Votes.subscribe(req.socket);

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

      Courses.publishCreate(course);
      return res.api.success({'course': course});
    });
  },

  update: function(req, res) {
    Courses.update({id: req.param('id')}, req.body).done(function(err, courses) {
      if (err || courses == undefined) {
        return res.api.failure(err);
      }

      Courses.publishUpdate(courses[0].id, courses[0]);
      return res.api.success({'course': courses[0]});
    });
  },

  remove: function(req, res) {
    Courses.destroy({id: req.param('id')}).done(function(err) {
      if (err) {
        return res.api.failure(err);
      }

      Courses.publishDestroy(req.param('id'));
      return res.api.success({});
    });
  }
};
