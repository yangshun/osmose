/**
 * User_role
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	user_id: {
		type: 'INTEGER',
		required: true
	},
	course_id: {
		type: 'INTEGER',
		required: true
	}
  }

};
