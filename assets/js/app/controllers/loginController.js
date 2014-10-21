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

angular.module('coinbingo')
  .controller('LoginController', LoginController);