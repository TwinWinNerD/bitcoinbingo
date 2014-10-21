function GamesController ($scope, $sailsSocket, $location) {
  $scope.idleGames = [];
  $scope.tables = {};

  $sailsSocket.get('/api/game', {
    data: {
      status: 'idle'
    }
  }).then(function (result) {
    for(var i = 0; i < result.data.length; i++) {
      var game = result.data[i];
      var table = game.table;

      $scope.tables[table.id] = table;

      game.trClass = getGameTrClass(game);
      game.table = table.id;

      $scope.idleGames.push(game);
    }
  });

  $sailsSocket.subscribe('game', function (result) {
    if(result.verb === 'updated') {
      for(var i = 0; i < $scope.idleGames.length; i++) {
        var game = $scope.idleGames[i];

        if(game.id === result.id) {
          delete result.data.messages;
          delete result.data.bingoCards;
          _.merge(game, result.data);
        }
      }
    }

    if(result.verb === 'created') {
      var game = result.data;
      game.trClass = getGameTrClass(game);
      $scope.idleGames.push(result.data);
    }
  });

  $sailsSocket.subscribe('table', function (result) {
    if(result.verb === 'updated') {
      $scope.tables[result.id] = result.data;
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
