module.exports = function (req, res, next) {

  if (typeof req.session !== 'undefined') {

    if (typeof req.session.user !== 'undefined') {
      return next();
    }

    return res.forbidden();
  }

  return res.forbidden();
};