function RegisterController ($scope, Auth, $location) {
  $scope.register = function () {
    console.log("register f");
    delete $scope.error;
    Auth.register({
        username: $scope.username
      },
      function (user) {
        console.log(user);
        $scope.setCurrentUser(user);
        $location.path('/');
      },
      function (err) {
        console.log(err);
        $scope.error = err.error;
      });
  };
}

app
  .controller('RegisterController', RegisterController);