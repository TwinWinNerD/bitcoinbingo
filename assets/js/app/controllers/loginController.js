function LoginController ($scope, Auth, $location) {
  $scope.loginProcess = false;

  $scope.login = function () {
    $scope.loginProcess = true;
    $scope.error = null;
    Auth.login({
        username: $scope.username,
        password: $scope.password
      },
      function (user) {
        $scope.loginProcess = false;
        $scope.setCurrentUser(user);
        $location.path('/');
      },
      function (err) {
        $scope.loginProcess = false;
        $scope.error = err.error;
      });
  };
}

angular.module('coinbingo')
  .controller('LoginController', LoginController);