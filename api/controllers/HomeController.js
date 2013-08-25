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
    console.log(req);
    // We only show the login page if the user is not login
    // If the user is login, we will redirect to the home page
    if (req.fb_id == 0) {
        redirect_url = req.protocol + "://" + req.get('host') + '/home'
        url = req.facebook.getLoginUrl({'redirect_uri': redirect_url});

        res.view({
            'fb_login_url': url
        }); 
    }
    else {
        res.redirect('/home');
    }
  }

};
