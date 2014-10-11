function GameController ($scope, $sailsSocket, $stateParams, $location) {
  $scope.game = {};

  $sailsSocket.get('/api/game/' + $stateParams.gameid).then(function (result) {
    $scope.game = result.data;
  }, function () {
    $location.path('404');
  });
}

app
  .controller('GameController ', GameController);
