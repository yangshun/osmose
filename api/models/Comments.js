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
  },

  getComments: function(options, cb) {
  	Comments.find(options).done(function(err, comments) {
  		if (err || comments === undefined) cb(err, undefined);
  		var next = function(err) {
  			// console.log(err)
  		}

  		var result = [];

  		async.eachSeries(comments,
  			function(comment, next) {
	  			Comments.getComment(comment.id, options, function(err, details) {
	  				if (!err) result.push(details);
	  				next(err);
	  			});
  			},
  			function(err) {
  				cb(err, result);
  			});
  	});
  },

  getComment: function(comid, options, cb) {
  	Comments.findOne({id: comid, deleted: false}).done(function(err, comment) {
      if (err || comment === undefined) return cb(err, undefined);
      var next = function(err) {
        // console.log(err);
      };     
      async.parallel([
        function(next) {
          Users.findOne(comment.user_id).done(function(err, user) {
            if (!err) comment.user = user;
            next(err);
          });
        }],
        function(err) {
          cb(err, comment); 
        });
    });
  },

  deleteComment: function(comid, options, cb) {
  	Comments.update({id: comid}, {deleted: true}, cb);
  }
};
