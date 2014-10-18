function LoginController ($scope, Auth, $location) {
  $scope.login = function () {
    $scope.error = null;
    Auth.login({
        username: $scope.username,
        password: $scope.password
      },
      function (user) {
        $scope.setCurrentUser(user);
        $location.path('/');
      },
      function (err) {
        $scope.error = err.error;
      });
  };
}

app
  .controller('LoginController', LoginController);