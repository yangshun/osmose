/**
 * Comments
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	parent_id: {
		type: 'INTEGER',
		required: true
	},
	parent_type: {
		type: 'STRING', // 'QUESTIONS' or 'ANSWERS'
		required: true,
		is: /\bQUESTION|ANSWER\b/
	},
	content: {
		type: 'TEXT',
		required: true,
		notEmpty: true
	},
	user_id: {
		type: 'INTEGER',
		required: true
	},
	deleted: {
		type: 'BOOLEAN',
		defaultsTo: false
	}
  }

};
