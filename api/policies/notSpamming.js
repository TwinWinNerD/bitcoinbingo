var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 100, true);

module.exports = function (req, res, next) {

  limiter.removeTokens(1, function (err, remainingRequests) {
    if (remainingRequests < 0) {
      return res.json({ error: "You are not allowed to make this request so soon." });
    }
    return next();
  });
};