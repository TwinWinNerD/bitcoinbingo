var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 250, true);

module.exports = function(req, res, next) {

    limiter.removeTokens(1, function(err, remainingRequests) {
        if(remainingRequests < 0 || req.session.user.isBusy) {
            return res.json({ error: "You are not allowed to make this request so soon." });
        }

        if(!req.session.user.isBusy) {
            req.session.user.isBusy = true;
            return next();
        }
    });
};