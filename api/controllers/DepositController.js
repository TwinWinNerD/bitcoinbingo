/**
 * DepositController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  callback: function (req, res) {
    var amount = req.param('value');
    var address = req.param('input_address');
    var hash = req.param('transaction_hash');
    var confirmations = req.param('confirmations');
    var confirmed = (confirmations > 0) ? 1 : 0;
    var secret = req.param('secret');

    if (amount < 0) {
      return res.ok('*ok*');
    }

    console.log(amount);
    console.log(address);
    console.log(hash);
    console.log(confirmations);
    console.log(confirmed);
    console.log(sails.config.blockchain.secret);

    if (secret !== sails.config.blockchain.secret) return res.badRequest('invalid secret');

    User.findOne().where({ depositAddress: address }).exec(function (err, user) {
      if (!err && user) {

        Deposit.findOne().where({ hash: hash}).exec(function (err, deposit) {

          if (!err && !deposit) {

            Deposit.create({
              amount: amount,
              depositType: 'bitcoin',
              hash: hash,
              confirmed: confirmed,
              user: user.id
            }).exec(function (err, deposit) {

              if (!err && deposit) {

                UserService.addBalance(user.id, amount).then(function (result) {
                  Deposit.publishCreate(deposit.toJSON());

                  if (confirmed > 0) {
                    return res.ok('*ok*');
                  }

                  return res.badRequest();
                });

              } else {
                return res.badRequest();
              }
            });
          } else if (deposit) {

            if (confirmed > 0) {
              Deposit.update(deposit.id, { confirmed: confirmed }).exec(function (err, result) {
                if (!err && result) {

                  Deposit.publishUpdate(deposit.id, { confirmed: confirmed }, null);
                  return res.ok('*ok*');
                } else {
                  return res.badRequest();
                }
              });
            } else {
              return res.badRequest();
            }
          }
        });
      } else {
        return res.badRequest();
      }
    });
  }
};
