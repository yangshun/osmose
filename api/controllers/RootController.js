/**
 * RootController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    if (req.session.fb_id == 0) {
        redirect_url = req.protocol + "://" + req.get('host') + '/'
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url, 'scope': 'publish_actions'});

        res.view({
            'fb_login_url': url,
            _layoutFile: 'index.ejs',
            fb_user: undefined
        }); 
    } else {
        res.redirect('/feed');
    }
  },

  feed: function (req, res) {
    req.facebook.api('/me', function(err, data) {
      res.view({
        fb_user: data,
        _layoutFile: '../layout.ejs'
      });
    })
  }
};
