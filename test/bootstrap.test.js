var Sails = require('sails');

before(function(done) {
  Sails.lift({
  }, function(err, sails) {
    if (err) return done(err);
    done(err, sails);
  });
});

after(function(done) {
  sails.lower(done);
});