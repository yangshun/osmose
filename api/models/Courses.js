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
  }

};
