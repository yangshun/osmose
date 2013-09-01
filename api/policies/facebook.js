/*
 * Facebook middleware
 *
 * Initialized the Facebook library, and also
 * add some helper properties to the request
 */
 
function facebook_middleware(req, res, next) {
    var Facebook = require('facebook-node-sdk');

    var facebook = new Facebook({   appId: '355786224555024', 
                                    secret: '6c70714fbc91767bf88edf756f3233d9',
                                    request: req,
                                    response: res });

    req.facebook = facebook;

    // Determine if the user is login to Facebook
    facebook.getUser(function(err, fb_id) {
        req.session.fb_id = fb_id;
        if (fb_id == 0) {
            next();
            return;
        }

        Users.find({facebook_id: fb_id}).done(function(err, users) {
            if (err) {
                return res.send(500);
            }

            req.facebook.api('/me', function(err, data) {
                // User does not exist, we create a new user
                if (users.length === 0) {
                    if (err) {
                        console.log(err);
                        return res.send(500);
                    }

                    Users.create({facebook_id: fb_id, name: data.name}).done(function(err, user){
                        if (err) {
                            return res.send(500);
                        }
                        req.session.user = user;
                        res.fb_user = data;
                        next();
                    });
                } else {
                    req.session.user = users[0];
                    res.fb_user = data;
                    next();
                }
            });
        });
    });
}

module.exports = facebook_middleware;