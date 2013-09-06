module.exports = function(req, res, next) {
    Courses.find({}).done(function(err, data){
        old_view = res.view;
        res.view = function(params) {
            if (!params) {
                params = {};
            }

            params.courses = data;
            old_view(params);
        }
        next();
    });
}