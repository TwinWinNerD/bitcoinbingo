function config ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('games', {
      url: '/',
      templateUrl: 'views/games.html',
      controller: 'GamesController',
      data: { pageTitle: 'Play bingo' }
    })
    .state('game', {
      url: '/game/:gameid',
      templateUrl: 'views/game.html',
      controller: 'GameController',
      data: { pageTitle: 'Game' }
    })
    .state('register', {
      url: '/register',
      templateUrl: 'views/common/register.html',
      controller: 'RegisterController',
      data: { pageTitle: 'Register' }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/common/login.html',
      controller: 'LoginController',
      data: { pageTitle: 'Login' }
    })
    .state('404', {
      url: '/404',
      templateUrl: 'views/common/404.html',
      data: { pageTitle: 'Page not found' }
    });

  $locationProvider.html5Mode(true);
}
app
  .config(config)
  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
  });