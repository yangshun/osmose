/*
 * Check and enforce Facebook login status
 */

function fb_auth(req, res, next) {
    if (req.session.fb_id == 0) {
        res.redirect('/home/login');
    }
    else {
        next();
    }
}

module.exports = fb_auth;