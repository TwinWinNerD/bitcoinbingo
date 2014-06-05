/**
 * GameController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

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
            "tableType": "Beginner 2v2"
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
            "tableType": "Beginner 4+"
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
            "tableType": "Beginner 10+"
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
            "tableType": "Medium 2v2"
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
            "tableType": "Medium 4+"
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
