function RegisterController ($scope, Auth, $location) {
  $scope.registerProcess = false;

  $scope.register = function () {
    $scope.registerProcess = true;
    delete $scope.error;
    Auth.register({
        username: $scope.username
      },
      function (user) {
        $scope.registerProcess = false;
        $scope.setCurrentUser(user);
        $location.path('/');
      },
      function (err) {
        $scope.registerProcess = false;
        $scope.error = err.error;
      });
  };
}

angular.module('coinbingo')
  .controller('RegisterController', RegisterController);