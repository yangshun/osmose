/**
 * CommentsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    return res.api.failure_code(404);
  },
  
  show: function(req, res) {
    var id = req.param('id');
    Comments.getComment(id, {}, function(err, comment) {
      if (err || comment == undefined) {
        return res.api.failure(err);
      }
      return res.api.success({'comment': comment});
    });
  },

  create: function(req, res) {
    if (req.body.user_id === undefined) {
      req.body.user_id = req.session.user.id;
    }

    Comments.create(req.body).done(function(err, comment) {
      if (err) {
        return res.api.failure(err);
      }
      Comments.getComment(comment.id, {}, function(err, comment) {
        Comments.publishCreate(comment);
        return res.api.success({'comment': comment});
      })
    });
  },

  update: function(req, res) {
    Comments.update({id: req.param('id')}, req.body).done(function(err, comments) {
      if (err || comments == undefined) {
        return res.api.failure(err);
      }
      Comments.getComment(comment.id, {}, function(err, comment) {
        Comments.publishUpdate(comments[0].id, comments[0]);
        return res.api.success({'comment': comments[0]});
      })
    });
  },

  remove: function(req, res) {
    Comments.deleteComment(req.param('id'), function(err, comments) {
      if (err) {
        return res.api.failure(err);
      }
      Comments.publishDestroy(req.param('id'));
      return res.api.success({'comment': comments[0]});
    });
  }
};
