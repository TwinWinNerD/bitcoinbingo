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
