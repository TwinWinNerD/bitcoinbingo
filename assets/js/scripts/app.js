socket = io.connect();

var BingoAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({

  restore: function (data) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      if (!Ember.isEmpty(data)) {
        resolve(data);
      } else {
        reject();
      }
    });
  },

  authenticate: function (credentials) {

    return new Ember.RSVP.Promise(function (resolve, reject) {
      socket.post('/login', {
        username: credentials.username,
        password: credentials.password
      }, function (response) {
        Ember.run(function () {
          if (response.error) {
            reject(response.error);
          } else if (response) {
            resolve(response);
          }
        });
      });
    });
  },

  invalidate: function () {
    return new Ember.RSVP.Promise(function (resolve) {
      socket.get('/logout', function () {
        resolve();
      });
    });
  },
});

Ember.Application.initializer({
  name: 'authentication',
  initialize: function (container, application) {
    container.register('authenticator:custom', BingoAuthenticator);

    Ember.SimpleAuth.Session.reopen({
      currentUser: function () {
        var userId = this.get('id');
        if (!Ember.isEmpty(userId)) {
          return container.lookup('store:main').find('user', userId);
        }
      }.property('id')
    });


    Ember.SimpleAuth.setup(container, application, {
      authorizerFactory: 'authorizer:custom',
      routeAfterAuthentication: 'games'
    });
  }
});

window.App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true
});

App.Router.map(function () {
  this.route('login');
  this.route('register');
  this.route('wallet');
  this.route('withdraw', { path: '/wallet/withdraw' });
  this.route('contact');
  this.resource('games', { path: '/' });
  this.resource('settings', { path: '/settings' });
  this.resource('gamesHistory', { path: '/history' });
  this.resource('game', { path: '/game/:game_id' });
});

Ember.LinkView.reopen({
  attributeBindings: ['data-uv-trigger']
});

UserVoice = window.UserVoice || [];
(function () {
  var uv = document.createElement('script');
  uv.type = 'text/javascript';
  uv.async = true;
  uv.src = '//widget.uservoice.com/Neq0A5TkWO0gPK4mIspXiw.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(uv, s)
})();

UserVoice.push(['set', {
  accent_color: '#448dd6',
  trigger_color: 'white',
  trigger_background_color: 'rgba(46, 49, 51, 0.6)'
}]);

UserVoice.push(['identify', {}]);
UserVoice.push(['addTrigger', { mode: 'contact', trigger_position: 'bottom-right' }]);
UserVoice.push(['autoprompt', {}]);