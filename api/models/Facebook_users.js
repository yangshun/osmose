/**
 * Facebook_user
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
	facebook_id: {
		type: 'STRING',
		required: true
	},

    name: {
        type: 'STRING',
        required: true
    },

    first_name: {
        type: 'STRING',
        required: false
    },

    last_name: {
        type: 'STRING',
        required: false
    },

    username: {
        type: 'STRING',
        required: true
    }
  }

};
