/**
 * Votes
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
		post_type: {
			type: 'STRING', // Questions, Answers or Comments
			required: true,
			is: /\bQUESTION|ANSWER|COMMENT\b/
		},
		post_id: {
			type: 'INTEGER',
			required: true
		},
		voter_id: {
			type: 'INTEGER',
			required: true
		},
		post_owner_id: {
			type: 'INTEGER',
			required: true
		},
		score: {
			type: 'INTEGER'
		},
		deleted: {
			type: 'BOOLEAN',
			defaultsTo: false
		}
  }
};