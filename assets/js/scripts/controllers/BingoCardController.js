App.BingoCardController = Ember.ObjectController.extend({
  needs: ['game'],
  pattern: Ember.computed.alias('controllers.game.pattern'),
  squares: function () {
    var squares, pattern, newSquares;

    squares = this.get('model.squares');
    pattern = this.get('pattern');

    newSquares = [
      [],
      [],
      [],
      [],
      []
    ]

    if (typeof squares !== 'undefined') {
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          if (pattern[i][j] === 1) {
            newSquares[i][j] = {
              pattern: true,
              number: squares[i][j]
            }
          } else {
            if (squares[i][j] === 0) {
              newSquares[i][j] = {
                pattern: false,
                number: "X"
              }
            } else {
              newSquares[i][j] = {
                pattern: false,
                number: squares[i][j]
              }
            }
          }
        }
      }
    }

    return newSquares;
  }.property('model.squares')
});