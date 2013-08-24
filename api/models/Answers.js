/**
 * Answers
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	question_id: {
		type: 'INTEGER',
		required: true,
	},
	user_id: {
		type: 'INTEGER',
		required: true
	},
	content: {
		type: 'TEXT',
		notEmpty: true
	},
	deleted: {
		type: 'BOOLEAN',
		defaultsTo: false
	}
  }

};
