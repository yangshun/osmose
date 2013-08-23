/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
  	res.view({
        'fb_id': req.fb_id
    });
  },

  login: function (req, res) {
    // We only show the login page if the user is not login
    // If the user is login, we will redirect to the home page
    if (req.fb_id == 0) {
        url = req.facebook.getLoginUrl({'redirect_uri': 'http://osmose.com:1337/home/'});

        res.view({
            'fb_login_url': url
        }); 
    }
    else {
        res.redirect('/home');
    }
  }

};
