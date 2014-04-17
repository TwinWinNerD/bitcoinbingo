/**
 * GameController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    play: function(req, res) {

        BingoService.settleRound(1, false).then( function (result) {
            res.ok(result);
        });

    },

    testData: function(req, res) {

        Table.create({
            "minimumPlayers": 2,
            "maximumPlayers": 100,
            "cardPrice": 1000,
            "tableStatus": "idle"
        }).exec(function (err, table) {

                Game.create({
                    table: table.id,
                    gameStatus: "idle",
                    serverSeed: SeedService.generateServerSeed(),
                }).exec(function (err, game) {
                        console.log(err);
                        console.log(game);
                        res.ok();
                });


            });

    }

};
