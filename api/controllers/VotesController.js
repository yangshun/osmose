/**
 * VotesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {  
  index: function(req, res) {
    res.api.failure();
  },

  show: function(req, res) {
    res.api.failure();
  },

  create: function(req, res) {
    Votes.create(req.body, function(err, vote) {
      if (err || vote === undefined) res.api.failure();
      else res.api.success({'vote': vote});
    });
  },

  update: function(req, res) {
    res.api.failure();
  },
  
  remove: function(req, res) {
    var vid = req.param('id');
    Votes.findOne(vid).done(function(err, vote) {
      if (err || vote === undefined) res.api.failure();
      vote.deleted = true;
      vote.destroy.done(function (err) {
        if (err) res.api.failure();
        else res.api.success({'vote': vote});
      });
    });
  }
};
