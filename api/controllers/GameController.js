/**
 * GameController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil;

actionUtil = require('../actionUtil');

module.exports = {

    find: function(req, res) {
        var Model = actionUtil.parseModel(req);

        // Lookup for records that match the specified criteria
        var query = Model.find()
            .where( actionUtil.parseCriteria(req) )
            .limit( actionUtil.parseLimit(req) )
            .skip( actionUtil.parseSkip(req) )
            .sort( actionUtil.parseSort(req) );


        query.populate('table');
        query.populate('bingoCards');
        query.populate('users');

        var requestGamesHistory = false;

        if(typeof actionUtil.parseCriteria(req).user !== 'undefined') {
            query = User.findOne(actionUtil.parseCriteria(req).user)
                .populate('games', {
                    where: { gameStatus: "finished"},
                    skip: actionUtil.parseSkip(req),
                    limit: actionUtil.parseLimit(req),
                    sort: actionUtil.parseSort(req)
                });

            requestGamesHistory = true;
        }

        query.exec(function found(err, matchingRecords) {
            if (err) return res.serverError(err);

            if (req._sails.hooks.pubsub && req.isSocket) {
                Model.subscribe(req, matchingRecords);
                if (req.options.autoWatch) { Model.watch(req); }

                // subscribe users to new game instances
                Model.watch(req);
            }

            var returnRecords = [];

            if(requestGamesHistory) {
                try {
                    returnRecords = matchingRecords.toJSON();
                    return res.ok(returnRecords.games);
                } catch(e) {
                    return res.forbidden();
                }

            }

            // remove data that needs to stay hidden
            for(var i = 0; i < matchingRecords.length; i++) {
                var game = matchingRecords[i];

                for(var j = 0; j < game.users.length; j++) {

                    if(typeof game.users[j] !== "undefined") {

                        if(typeof game.users[j].email !== "undefined") delete game.users[j].email;
                        // if(typeof game.users[j].balance !== "undefined") delete game.users[j].balance;

                    }
                }

                returnRecords.push(game);
            }

            res.ok(returnRecords);
        });
    },

    findOne: function (req, res) {
        var Model = actionUtil.parseModel(req);
        var pk = actionUtil.requirePk(req);

        var query = Model.findOne(pk);

        query = actionUtil.populateEach(query, req.options);

        query.exec(function found(err, matchingRecord) {
            if (err) return res.serverError(err);
            if(!matchingRecord) return res.notFound('No record found with the specified `id`.');

            if (sails.hooks.pubsub && req.isSocket) {
                Model.subscribe(req, matchingRecord);
            }

            for(var i = 0; i < matchingRecord.users.length; i++) {
                if (typeof matchingRecord.users[i] !== "undefined") {

                    if (typeof matchingRecord.users[i].email !== "undefined") delete matchingRecord.users[i].email;
                    // if (typeof matchingRecord.users[i].balance !== "undefined") delete matchingRecord.users[i].balance;

                }
            }

            res.ok(matchingRecord);

        });
    },

    play: function(req, res) {

        BingoService.settleRound(req.param('gameId'), false).then( function (result) {
            res.ok(result);
        });

    },

    testData: function(req, res) {

        Table.create({
            "minimumPlayers": 2,
            "maximumPlayers": 2,
            "maximumCards": 10,
            "cardPrice": 1000,
            "tableType": "beginner"
        }).exec(function (err, table) {

                Game.create({
                    table: table.id,
                    gameStatus: "idle",
                    serverSeed: SeedService.generateServerSeed(),
                    pattern: PatternService.getRandomPattern()
                }).exec(function (error, game) {
                    if(!error) {

                        Game.publishCreate(game);

                        res.ok();

                    }
                });
            });

        Table.create({
            "minimumPlayers": 4,
            "maximumPlayers": 10,
            "maximumCards": 10,
            "cardPrice": 1000,
            "tableType": "beginner"
        }).exec(function (err, table) {

            Game.create({
                table: table.id,
                gameStatus: "idle",
                serverSeed: SeedService.generateServerSeed(),
                pattern: PatternService.getRandomPattern()
            }).exec(function (error, game) {
                if(!error) {

                    Game.publishCreate(game);

                    res.ok();

                }
            });
        });

        Table.create({
            "minimumPlayers": 10,
            "maximumPlayers": 100,
            "maximumCards": 10,
            "cardPrice": 1000,
            "tableType": "beginner"
        }).exec(function (err, table) {

            Game.create({
                table: table.id,
                gameStatus: "idle",
                serverSeed: SeedService.generateServerSeed(),
                pattern: PatternService.getRandomPattern()
            }).exec(function (error, game) {
                if(!error) {

                    Game.publishCreate(game);

                    res.ok();

                }
            });
        });

        Table.create({
            "minimumPlayers": 2,
            "maximumPlayers": 2,
            "maximumCards": 10,
            "cardPrice": 10000,
            "tableType": "medium"
        }).exec(function (err, table) {

            Game.create({
                table: table.id,
                gameStatus: "idle",
                serverSeed: SeedService.generateServerSeed(),
                pattern: PatternService.getRandomPattern()
            }).exec(function (error, game) {
                if(!error) {

                    Game.publishCreate(game);

                    res.ok();

                }
            });
        });

        Table.create({
            "minimumPlayers": 4,
            "maximumPlayers": 100,
            "maximumCards": 10,
            "cardPrice": 10000,
            "tableType": "medium"
        }).exec(function (err, table) {

            Game.create({
                table: table.id,
                gameStatus: "idle",
                serverSeed: SeedService.generateServerSeed(),
                pattern: PatternService.getRandomPattern()
            }).exec(function (error, game) {
                if(!error) {

                    Game.publishCreate(game);

                    res.ok();

                }
            });
        });

        Table.create({
            "minimumPlayers": 2,
            "maximumPlayers": 2,
            "maximumCards": 10,
            "cardPrice": 100000,
            "tableType": "hard"
        }).exec(function (err, table) {

            Game.create({
                table: table.id,
                gameStatus: "idle",
                serverSeed: SeedService.generateServerSeed(),
                pattern: PatternService.getRandomPattern()
            }).exec(function (error, game) {
                if(!error) {

                    Game.publishCreate(game);

                    res.ok();

                }
            });
        });
    }

};
