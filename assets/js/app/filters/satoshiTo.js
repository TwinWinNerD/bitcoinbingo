app
  .filter('satoshiToBits', function() {
    return function(input) {
      return (input / 100) + " Bits";
    };
  })
  .filter('satoshiToMBTC', function() {
    return function(input) {
      return (input / 100000) + " mBTC";
    };
  });