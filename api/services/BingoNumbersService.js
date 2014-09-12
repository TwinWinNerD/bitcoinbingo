var Random = require('random-js');

module.exports = function () {

  for (var i = 1; i <= 75; i++) {
    this.push(i);
  }
};

module.exports.prototype = [];

module.exports.prototype.shuffle = function (seed) {
  var engine = Random.engines.mt19937().seed(seed);

  return Random.shuffle(engine, this);
};