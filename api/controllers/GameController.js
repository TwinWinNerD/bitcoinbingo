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
            "maximumPlayers": 100,
            "maximumCards": 10,
            "cardPrice": 1000,
            "tableType": "beginner"
        }).exec(function (err, table) {

                Game.create({
                    table: table.id,
                    gameStatus: "idle",
                    serverSeed: SeedService.generateServerSeed(),
                }).exec(function (error, game) {
                    if(!error) {

                        Game.publishCreate(game);

                        res.ok();

                    }
                });


            });

    }

};
