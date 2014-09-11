App.GamesView = Ember.View.extend({
  didInsertElement: function () {

    socket.get('/api/statistics', updateStatistics);
    socket.on('statistics', updateStatistics);

    function updateStatistics (result) {
      if (typeof result.error === "undefined") {
        $("#users").html(result.users);
        $("#cardsBought").html(result.cardsBought);
        $("#wagered").html(satoshiToBits(result.wagered) + ' <small style="color: #FFF">Bits</small>');
        $("#payout").html(satoshiToBits(result.payout) + ' <small style="color: #FFF">Bits</small>');
        $("#promotion").html(satoshiToBits(result.promotion) + ' <small style="color: #FFF">Bits</small>');
      }
    }
  }
});