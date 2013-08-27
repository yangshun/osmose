/*
 * Check and enforce Facebook login status
 */

function fb_auth(req, res, next) {
    if (req.session.fb_id == 0) {
        res.redirect('/');
    }
    else {
        next();
    }
}

module.exports = fb_auth;