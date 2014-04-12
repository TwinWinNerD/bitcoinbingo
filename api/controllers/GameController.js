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

    }

};
