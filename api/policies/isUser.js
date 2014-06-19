module.exports = function(req, res, next) {

    var id = req.options.id || (req.options.where && req.options.where.id) || req.param('id');

    if(id === req.session.user.id) {
        return next();
    }

    return res.forbidden();
};