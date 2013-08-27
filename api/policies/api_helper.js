module.exports = function(req, res, next) {
    res.api = {
        'success': function(data) {
            res.json({'success': true, 'data': data});
        },
        'failure': function(error) {
            res.json({'success': false, 'data': {}, 'error': error});
        },
        'failure_message': function(message) {
            res.json({'success': false, 'data': {}, 'error': {'message': message}});
        },
        'failure_code': function(code) {
            message = 'Unknown';
            if (code == 404) {
                message = 'Not Supported';
            }
            res.json({'success': false, 'data': {}, 'error': {'message': message}});
        }
    }
    next();
}