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
    Courses.getCoursesWithDetails(user_id, function(err, data){
      if (err || data == undefined) {
        return res.api.failure(err);
      }
      return res.api.success(data);
    });
  },
  
  show: function(req, res) {
    var id = req.param('id');
    Courses.getCourseWithDetails(id, {user: req.session.user.id}, function(err, data) {
      if (err || data == undefined) {
        return res.api.failure(err);
      }
      return res.api.success(data);

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

      Courses.publish(null, {
        id: courses[0].id,
        model: 'courses',
        verb: 'update',
        data: courses[0]});
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
  },

  details: function(req, res) {
    var cid = req.param('id');
    Courses.getCourseWithDetails(cid, {user: req.session.user.id}, function(err, course) {
      if (err || course === undefined) { return res.render(404); }
      res.view({
        _layoutFile: '../layout.ejs',
        display_type: 'course',
        course: course,
        fb_user: req.session.fb_user
      });
    });
  },

  stub: function(req, res) {
    // Might want to return list of courses that this user attends
    // When we add the users-courses model in the future
    var user_id = req.session.user.id;
    Courses.find({}).done(function(err, data){
      if (err || data == undefined) {
        return res.api.failure(err);
      }
      return res.api.success(data);
    });
  },
  
};
