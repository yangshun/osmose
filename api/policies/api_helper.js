module.exports = function(req, res, next) {
    res.api = {
        'success': function(data) {
            res.json({'success': true, 'data': data});
        },
        'failure': function() {
            res.json({'success': false, 'data': {}});
        }
    }
    next();
}