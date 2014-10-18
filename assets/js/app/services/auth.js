app
  .factory('Auth', function ($sailsSocket, $location, $cookieStore, Session) {

    return {
      register: function (user, success, err) {
        $sailsSocket.post('/api/user', user).success(function (res) {
          Session.create(res);
          success(res);
        }).error(err);
      },
      login: function (user, success, err) {
        $sailsSocket.post('/login', user).success(function (result) {
          Session.create(result);
          success(result);
        }).error(err);
      },
      logout: function (success, err) {
        $sailsSocket.get('/logout').success(function () {
          Session.destroy();
          success();
        }).error(err);
      }
    };
  });