/**
 * protectedAttributes
 *
 * @module      :: Policy
 * @description :: Simple policy to protect certain attributes as returned by Model.protectedAttributes()
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

var actionUtil = require('./../actionUtil');

module.exports = function (req, res, next) {

  var Model = actionUtil.parseModel(req);

  if (Model.protectedAttributes) {
    var attributes = Model.protectedAttributes();
    _.each(attributes, function (attr) {
      if (req.params.hasOwnProperty(attr)) {
        delete req.params[ attr ];
      }
      if (req.query.hasOwnProperty(attr)) {
        delete req.query[ attr ];
      }
      if (req.body.hasOwnProperty(attr)) {
        delete req.body[ attr ];
      }

    });
  }
  return next();
};