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

    }


};
