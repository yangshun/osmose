/**
 * CommentsController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    return res.api.failure();
  },
  
  show: function(req, res) {
    var id = req.param('id');
    Comments.findOne({id: id, deleted: false}).done(function(err, comment) {
      if (err || comment == undefined) {
        return res.api.failure();
      }
      return res.api.success({'comment': comment});
    });
  },

  create: function(req, res) {
    Comments.create(req.body).done(function(err, comment) {
      if (err) {
        return res.api.failure();
      }
      return res.api.success({'comment': comment});
    });
  },

  update: function(req, res) {
    Comments.update({id: req.param('id')}, req.body).done(function(err, comments) {
      if (err || comments == undefined) {
        return res.api.failure();
      }
      return res.api.success({'comment': comments[0]});
    });
  },

  remove: function(req, res) {
    Comments.deleteComment(req.param('id'), function(err, comments) {
      if (err) {
        return res.api.failure();
      }
      return res.api.success({'comment': comments[0]});
    });
  }
};
