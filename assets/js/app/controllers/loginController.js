function LoginController ($scope, Auth, $location) {
  $scope.error = {};
  $scope.user = {};

  $scope.login = function(form) {
    Auth.login('password', {
        'email': $scope.user.email,
        'password': $scope.user.password
      },
      function(err) {
        $scope.errors = {};

        if (!err) {
          $location.path('/');
        } else {
          console.log(err);
        }
      });
  };
}

app
  .controller('LoginController', LoginController);