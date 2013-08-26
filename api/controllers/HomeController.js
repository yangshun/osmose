/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    console.log(req.session.user);
    
    return res.view({
        'fb_id': req.session.fb_id,
        'user': req.session.user
      });
  },

  login: function (req, res) {
    // We only show the login page if the user is not login
    // If the user is login, we will redirect to the home page
    if (req.session.fb_id == 0) {
        redirect_url = req.protocol + "://" + req.get('host') + '/home'
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url});

        res.view({
            'fb_login_url': url
        }); 
    }
    else {
        res.redirect('/home');
    }
  },

  landing: function (req, res) {
    if (req.session.fb_id == 0) {
        redirect_url = req.protocol + "://" + req.get('host') + '/home'
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url});

        res.view({
            'fb_login_url': url,
            _layoutFile: '../landing-layout.ejs'
        }); 
    }
    else {
        res.redirect('/home');
    }
  }
};
