function ApplicationController ($scope, $cookieStore, $location, $sailsSocket, Session, Auth) {
  $scope.currentUser = $cookieStore.get('user') ? { id: $cookieStore.get('user') } : null;


  $scope.setCurrentUser = function (user) {
    $cookieStore.put('user', user.id);
    $scope.currentUser = user;
  };

  $scope.deleteCurrentUser = function () {
    $cookieStore.remove('user');
    delete $scope.currentUser;
  };

  $scope.findCurrentUser = function () {
    if ($cookieStore.get('user')) {
      $sailsSocket.get('/api/user/' + $cookieStore.get('user'))
        .success(function (result) {
          if(result.isYou) {
            $scope.currentUser = result;
          } else {
            $scope.deleteCurrentUser();
          }
        }).error(function () {
          $scope.deleteCurrentUser();
          $location.path('/register');
        });
    } else {
      $location.path('/register');
    }
  };

  $scope.logout = function () {
    Auth.logout(function () {
      $scope.deleteCurrentUser();
      $location.path('/login');
    }, function () {
      $scope.error = "Couldn't logout";
    });
  };


  $sailsSocket.subscribe('user', function (result) {
    if(result.verb === 'updated') {
      console.log(result.data);
      angular.extend($scope.currentUser, result.data);
    }
  });

  $scope.findCurrentUser();
}

angular.module('coinbingo')
  .controller('ApplicationController', ApplicationController);