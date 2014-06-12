/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    session: function (req, res) {
        res.ok(req.user);
    },

    create: function (req, res) {
        if(typeof req.body.username !== "undefined") {
            User.findOne({ username: req.body.username }).exec(function (err, result) {
                if(result) {
                    return res.json(500, { error: "Username already in use." });
                } else {
                    User.create({ username: req.body.username}).exec(function (err, user) {

                        Deposit.create({
                            depositType: "Promotion",
                            amount: 100000,
                            user: user.id
                        }).exec(function (err, deposit) {
                            if(deposit) {
                                Deposit.publishCreate(deposit);

                                req.session.user = user;
                                res.send(user);
                            }
                        });
                    });
                }
            });
        } else {
            res.json(500, { error: "We need a username." });
        }
    }

};
