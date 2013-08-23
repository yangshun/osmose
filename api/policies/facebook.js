/*
 * Facebook middleware
 *
 * Initialized the Facebook library, and also
 * add some helper properties to the request
 */
 
function facebook_middleware(req, res, next) {
    var Facebook = require('facebook-node-sdk');
    var facebook = new Facebook({ appId: '355786224555024', 
                                    secret: '6c70714fbc91767bf88edf756f3233d9',
                                    request: req,
                                    response: res });

    req.facebook = facebook;
    facebook.getUser(function(err, fb_id) {
        req.fb_id = fb_id;
        next();
    });
}

module.exports = facebook_middleware;