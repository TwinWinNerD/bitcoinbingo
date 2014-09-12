/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {
  User.query("ALTER TABLE `user` CHANGE `balance` `balance` INT(11) UNSIGNED", function (err, result) {
      if(!err && result) {
        cb();
      } else {
        console.log(err);
        console.log(result);
      }
    });
};