var Sails = require('sails');

before(function(done) {
  this.timeout(10000);
  
  Sails.lift({
    connections: {
      bitcoinBingoMySQL: {
        database: 'coinbingo-test'
      }
    }
  }, function(err, sails) {
    if (err) return done(err);
    done(err, sails);
  });
});

after(function(done) {
  sails.lower(done);
});