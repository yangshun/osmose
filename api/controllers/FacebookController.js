/**
 * FacebookController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  feed: function(req, res) {
    // Check if there is any message in the post body
    if (req.body.message) {
        req.facebook.api('/me/feed', 'POST', req.body, function(err, data) {
            if (err) {
                res.api.failure(err);
            }
            else {
                res.api.success(data)
            }
        });
    }
  }
};
