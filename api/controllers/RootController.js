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
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url});

        res.view({
            'fb_login_url': url,
            _layoutFile: 'index.ejs'
        }); 
    }
    else {
        res.redirect('/feed');
    }
  },

  feed: function (req, res) {
    res.send('feed')
  }
};
