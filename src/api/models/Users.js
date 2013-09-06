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
			type: 'STRING',
			required: true
		},
		name: {
			type: 'STRING'
		},
		deleted: {
			type: 'BOOLEAN',
			defaultsTo: false
		}
  },

  getUserProfile: function(uid, options, cb) {
  	Users.findOne({id: uid, deleted: false}).done(function(err, user) {
  		if (err || user === undefined) return cb(err, undefined);

  		var next = function(err) {
        // console.log(err);
      };     

      async.parallel([
        function(next) {
          Votes.find({post_owner_id: uid, deleted: false}).done(function(err, votes) {
            if (!err) {
              var score = 0;
              votes.forEach(function(vote) { score += vote.score; });
              user.score = score;
            }
            next(err);
          });
        }],
        function(err) {
          cb(err, user); 
        });
  	});
  }
};
