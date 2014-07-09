module.exports = function(req, res, next) {

    var user = req.options.user || (req.options.where && req.options.where.user) || req.param('user');

    if(user == req.session.user.id) {
        return next();
    }

    return res.forbidden();
};