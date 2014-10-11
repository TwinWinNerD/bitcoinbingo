function GamesController ($scope, $sailsSocket, $location) {
  $scope.games = [];

  $sailsSocket.get('/api/game').then(function (result) {
    $scope.games = result.data;
  });

  $scope.go = function (game) {
    $location.path('/game/' + game.id);
  };
}

app
  .controller('GamesController ', GamesController);
