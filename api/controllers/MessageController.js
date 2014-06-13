/**
 * MessageController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil;

actionUtil = require('../actionUtil');

module.exports = {
    create: function(req, res) {
        var Model = actionUtil.parseModel(req);

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        if(typeof req.session.user !== "undefined" && req.session.user !== null) {
            data.user = req.session.user.username;

            Message.create(data).exec(function created (err, newInstance) {

                // Differentiate between waterline-originated validation errors
                // and serious underlying issues. Respond with badRequest if a
                // validation error is encountered, w/ validation info.
                if (err) return res.negotiate(err);

                // If we have the pubsub hook, use the model class's publish method
                // to notify all subscribers about the created item
                if (req._sails.hooks.pubsub) {
                    if (req.isSocket) {
                        Model.subscribe(req, newInstance);
                        Model.introduce(newInstance);
                    }

                    Model.publishCreate(newInstance, !req.options.mirror && req);
                }

                res.ok(newInstance.toJSON());


            });

        }
    }
};
