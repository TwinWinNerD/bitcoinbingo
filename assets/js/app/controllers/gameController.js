function GameController ($scope, $sailsSocket, $stateParams, $location, $filter) {
  $scope.game = {};
  $scope.bingoCards = [];
  $scope.cardsToBuy = [];

  $sailsSocket.get('/api/game/' + $stateParams.gameid).then(function (result) {
    $scope.game = result.data;
    getBingoCards();
  }, function () {
    $location.path('404');
  });

  $sailsSocket.subscribe('game', function (result) {
    if(result.id && result.id !== $scope.game.id) return;

    if(result.verb === 'updated') {
      angular.extend($scope.game, result.data);
    }
  });

  $scope.selectCard = function () {
    console.log("selectCard");
    if(this.bingoCard.bought) return;

    this.bingoCard.buy = !this.bingoCard.buy;
  };

  $scope.buySelectedCards = function () {
    console.log("buySelectedCards");
    var bingoCards = $scope.bingoCards;

    var bingoCardsToBuy = [];

    for(var i = 0; i < bingoCards.length; i++) {
      var bingoCard = bingoCards[i];

      if(bingoCards[i].buy) bingoCardsToBuy.push(bingoCard)
    }

    console.log(bingoCardsToBuy);
  };

  $("#amountOfCards").on('slide slideStop', function () {
    var amount = $(this).val();
    var bingoCards = $filter('orderBy')($scope.bingoCards, [$scope.orderByDrawnNumbers, $scope.orderByNonce], true);

    for(var i = 0; i < amount; i++) {
      if(bingoCards[i].bought) continue;
      bingoCards[i].buy = true;
    }

    for(var j = amount; j < $scope.bingoCards.length; j++) {
      if(bingoCards[j].bought) continue;
      bingoCards[j].buy = false;
    }

    $scope.$apply();
  });

  $scope.orderByNonce = function (card) {
    var count = 0;
    if(card.bought) count += 24;

    return card.nonce + count;
  };

  $scope.orderByDrawnNumbers = function(card) {
    var drawnNumbers = $scope.game.drawnNumbers;
    var count = 1;

    if(card.bought) count += 24;

    for(var i = 0; i < 5; i++) {
      for(var j = 0; j < 5; j++) {
        var squares = card.squares;

        if(drawnNumbers.indexOf(squares[i][j]) !== -1) count++;
      }
    }
    return count;
  };

  function getBingoCards() {
    if($scope.currentUser) {
      var config = {};
      config.data = {
        user: $scope.currentUser.id,
        sort: 'nonce ASC'
      };
      $sailsSocket.get('/api/game/' + $stateParams.gameid + '/bingoCards', config).then(function (result) {
        $scope.bingoCards = $filter('orderBy')(result.data, $scope.orderByNonce, true);
      }, function () {
        $location.path('404');
      });
    }
  }

  $('#amountOfCards').bootstrapSlider({
    formatter: function(value) {
      return 'Amount of cards: ' + value;
    }
  });
}

app
  .controller('GameController', GameController);
