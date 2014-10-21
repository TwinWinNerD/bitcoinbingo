function GamesController ($scope, $sailsSocket, $location) {
  $scope.idleGames = [];

  $sailsSocket.get('/api/game', {
    data: {
      status: 'idle'
    }
  }).then(function (result) {
    for(var i = 0; i < result.data.length; i++) {
      var game = result.data[i];
      game.trClass = getGameTrClass(game);
      $scope.idleGames.push(game);
    }
  });

  $sailsSocket.subscribe('game', function (result) {
    if(result.verb === 'updated') {
      for(var i = 0; i < $scope.idleGames.length; i++) {
        var game = $scope.idleGames[i];

        if(game.id === result.id) {
          delete result.data.messages;
          delete result.data.table;
          delete result.data.bingoCards;
          _.merge(game, result.data);
        }
      }
    }
  });

  $sailsSocket.subscribe('table', function (result) {
    if(result.verb === 'updated') {
      for(var i = 0; i < $scope.idleGames.length; i++) {
        var game = $scope.idleGames[i];

        if(game.table.id === result.id) {
          _.merge(game.table, result.data);
        }
      }
    }
  });

  $scope.go = function (game) {
    $location.path('/game/' + game.id);
  };
}

function getGameTrClass(game) {
  switch(game.table.tableType) {
    case 'beginner':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'danger';
    default:
      return 'success';
  }
}

angular.module('coinbingo')
  .controller('GamesController', GamesController);
