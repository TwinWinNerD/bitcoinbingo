/**
 * BingoCardController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil;

actionUtil = require('../actionUtil');

module.exports = {

    find: function (req, res) {

        var query;

        query = BingoCard.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );

        query = actionUtil.populateEach(query, req.options);

        query.exec( function (err, result) {

            for(var i = 0; i < result.length; i++) {
                result[i].squares = BingoCardService.generateSquares(result[i].game.serverSeed, result[i].clientSeed, result[i].id)
            }

            if (req._sails.hooks.pubsub && req.isSocket) {
                BingoCard.subscribe(req, result);
                if (req.options.autoWatch) { BingoCard.watch(req); }
                // Also subscribe to instances of all associated models
                _.each(result, function (record) {
                    actionUtil.subscribeDeep(req, record);
                });
            }

            res.ok(result);
        });
    },

    create: function(req, res) {
        var Model = actionUtil.parseModel(req);

        // Create data object (monolithic combination of all parameters)
        // Omit the blacklisted params (like JSONP callback param, etc.)
        var data = actionUtil.parseValues(req);

        if(typeof req.user.id !== "undefined") {
            data.user = req.user.id;

            // TODO: determine price, create deposit etc

            // Create new instance of model using data from params
            Model.create(data).exec(function created (err, newInstance) {

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

                // Send JSONP-friendly response if it's supported
                // (HTTP 201: Created)
                res.status(201);
                res.ok(newInstance.toJSON());
            });
        } else {
            res.forbidden('Need to be logged in to buy cards');
        }
    }
};
