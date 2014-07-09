/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var actionUtil;

actionUtil = require('../actionUtil');

module.exports = {

    session: function (req, res) {
        res.ok(req.user);
    },

    create: function (req, res) {
        if(typeof req.body.username !== "undefined" && req.body.username !== "") {
            User.findOne({ username: req.body.username }).exec(function (err, result) {
                if(result) {
                    return res.json(500, { error: "Username already in use." });
                } else {
                    User.create({ username: req.body.username, balance: 100000, clientSeed: SeedService.generateClientSeed() }).exec(function (err, user) {

                        if(!err && user) {
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
                        } else {
                            res.json(500, { error: "Couldn't create your account. Is your username at least 3 characters?" });
                        }

                    });
                }
            });
        } else {
            res.json(500, { error: "We need a username." });
        }
    },

    findOne: function (req, res) {
        var pk = actionUtil.requirePk(req);

        var query = User.findOne(pk);

        query.exec(function found(err, user) {
            if (err) return res.serverError(err);
            if(!user) return res.notFound('No record found with the specified `id`.');

            if(typeof user.depositAddress === "undefined" || user.depositAddress === "") {

                BlockchainService.createAddress(user).then(function (result) {
                    if(result.address) {
                        User.update(user.id, { depositAddress: result.address }).exec(function (err, result) {
                            User.publishUpdate(user.id, { depositAddress: result.address }, null);
                        });
                    }
                });
            }

            if (sails.hooks.pubsub && req.isSocket) {
                User.subscribe(req, user);
                actionUtil.subscribeDeep(req, user);
            }
            res.ok(user);
        });
    }

};
