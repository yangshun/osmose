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

            var populateSession = function(user, fb_user) {
                req.session.user = user;
                req.session.fb_user = fb_user;
                next();
            }

            if (users.length == 0) {
                req.facebook.api('/me', function(err, data) {
                    if (err) {
                        return res.send(500);
                    }

                    Users.create({facebook_id: fb_id, name: data.name}).done(function(err, user) {
                        if (err) {
                            return res.send(500);
                        }

                        fb_data = {facebook_id: fb_id, 
                                          name: data.name, 
                                    first_name: data.first_name, 
                                     last_name: data.last_name, 
                                      username: data.username};

                        Facebook_users.create(fb_data).done(function(err, fb_user) {
                            if (err) {
                                return res.send(500);
                            }
                            populateSession(user, fb_user);
                        });
                    });
                });
            }

            else {
                Facebook_users.find({facebook_id: fb_id}).done(function(err, fb_users) {
                    if (err) {
                        return res.send(500);
                    }

                    if (fb_users.length == 0) {
                        // This is a regression; should not happen
                        res.send(500);
                    }

                    populateSession(users[0], fb_users[0]);
                });
            }
        });
    });
}

module.exports = facebook_middleware;