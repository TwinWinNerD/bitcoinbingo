function GamesController ($scope, $sailsSocket, $location) {
  var app = this;

  app.test = "test";
  console.log("test controller");

  $scope.games = [];

  $sailsSocket.get('/api/game').then(function (result) {
    console.log(result);
    $scope.games = result.data;
  });

  $scope.go = function (game) {
    $location.path('/game/' + game.id);
  };
}

app
  .controller('GamesController ', GamesController);
