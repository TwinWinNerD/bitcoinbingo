angular.module('coinbingo')
  .filter('satoshiToBits', function() {
    return function(input) {
      input = (input / 100);
      input = numberWithCommas(input);
      return input + " Bits";
    };
  })
  .filter('satoshiToMBTC', function() {
    return function(input) {
      input = (input / 100000);
      input = numberWithCommas(input);
      return input + " mBTC";
    };
  });

function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}