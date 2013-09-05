/**
 * Courses
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	course_name: {
  		type: 'STRING',
  		required: true,
  		notEmpty: true
  	},
  	description: {
  		type: 'TEXT'	
  	},
    deleted: {
      type: 'BOOLEAN',
      defaultsTo: false
    }
  },

  getCoursesWithDetails: function(user_id, cb) {
    var next = function(err, data){
      // console.log(err);
    }

    Courses.find({deleted: false}).done(function(err, data) {
      async.parallel(data.map(function(course) {
          return function(next) {
            Questions.getQuestionsOfCourse(course.id, {user: user_id}, function(err, res) {
              course.questions = res;
              next(err);
            });
          }
        }),
        function(err) {
          cb(err, data);
        }) 
    })
  },

  getCourseWithDetails: function(cid, options, cb) {
    Courses.findOne({id: cid, deleted: false}).done(function(err, course) {
      if (err || course == undefined) {
        return cb(err, null);
      }

      Questions.getQuestionsOfCourse(course.id, options, function(err, questions) {
        if (err || questions == undefined) {
          return cb(err, null);
        }
        course.questions = questions;
        return cb(null,course);
      })
    });
  }

};
