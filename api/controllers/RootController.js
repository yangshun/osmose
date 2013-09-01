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
            fb_user: undefined,
            title: 'Osmose'
        }); 
    } else {
        res.redirect('/feed');
    }
  },

  feed: function (req, res) {
    console.log(res.fb_user);
    res.view({
      _layoutFile: '../layout.ejs'
    });
  }
};
