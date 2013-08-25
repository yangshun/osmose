/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	facebook_id: {
		type: 'INTEGER',
		required: true
	},
	name: {
		type: 'STRING'
	},
	deleted: {
		type: 'BOOLEAN',
		defaultsTo: false
	}
  }

};
