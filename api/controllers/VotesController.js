/**
 * VotesController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var changeVote = function(req, res, value_change) {
    var post_type = req.param('post_type');
    var post_id = req.param('post_id');
    var voter_id = req.session.user.id;

    Votes.findOne({post_type: post_type, post_id: post_id, voter_id: voter_id}).done(function(err, vote) {
      if (err || vote == undefined) {
        if (post_type === "QUESTION") {
          Questions.findOne(post_id).done(function(err, question) {
            if (err) return res.api.failure(err);
            else {
              Votes.create({
                post_type: "QUESTION",
                post_id: post_id, 
                voter_id: voter_id,
                post_owner_id: question.user_id,
                score: value_change,
                deleted: false
              }).done(function(err, vote) {
                // console.log(vote);
                if (err) return res.api.failure(err);
                else {
                  Votes.publishCreate(vote);
                  res.api.success({vote: vote});
                }
              });
            }
          });
        } else if (post_type === "ANSWER") {
          Answers.findOne(post_id).done(function(err, answer) {
            if (err) return res.api.failure(err);
            else {
              Votes.create({
                post_type: "ANSWER",
                post_id: post_id, 
                voter_id: voter_id,
                post_owner_id: answer.user_id,
                score: value_change,
                deleted: false
              }).done(function(err, vote) {
                if (err) return res.api.failure(err);
                else {
                  Votes.publishCreate(vote);
                  res.api.success({vote: vote});
                }
              });
            }
          });
        }
      } else {
        if (vote.score != value_change) {  vote.score = value_change; } 
        else { vote.score = 0; }

        vote.save(function(err) {
          if (err) res.api.failure(err);
          else {
            Votes.publish(null, {
              id: vote.id,
              model: 'votes',
              verb: 'update',
              data: vote 
            });
            res.api.success({vote: vote});
          }
        });
      }
    });
  }

module.exports = {  
  index: function(req, res) {
    res.api.failure_code(404);
  },

  show: function(req, res) {
    res.api.failure_code(404);
  },

  create: function(req, res) {
    req.body.voter_id = req.session.user.id;
    Votes.create(req.body, function(err, vote) {
      if (err || vote === undefined) res.api.failure(err);
      else {
        res.api.success({'vote': vote});
        Votes.publishCreate(vote);
      }
    });
  },

  update: function(req, res) {
    res.api.failure_code(404);
  },
  
  remove: function(req, res) {
    var vid = req.param('id');
    Votes.findOne(vid).done(function(err, vote) {
      if (err || vote === undefined) res.api.failure(err);
      vote.deleted = true;
      vote.destroy.done(function (err) {
        if (err) res.api.failure(err);
        else {
          res.api.success({'vote': vote});
          Votes.publishDestroy(req.param('id'));
        }
      });
    });
  },

  upvote: function(req, res) {
    // var post_type = req.param('post_type');
    // var post_id = req.param('post_id');
    // var voter_id = req.param('voter_id');
    // console.log(this);
    changeVote(req, res, 1);
  },

  downvote: function(req, res) {
    // var post_type = req.param('post_type');
    // var post_id = req.param('post_id');
    // var voter_id = req.param('voter_id');
    changeVote(req, res, -1);
  }
};
