var actionUtil = require('../actionUtil');

module.exports = {

  find: function (req, res) {
    var query = Game.find()
      .where(actionUtil.parseCriteria(req))
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req));

    query.populate('table');
    query.populate('users');

    var requestGamesHistory = false;

    if (typeof actionUtil.parseCriteria(req).user !== 'undefined') {
      query = User.findOne(actionUtil.parseCriteria(req).user)
        .populate('games', {
          where: { status: "finished"},
          skip: actionUtil.parseSkip(req),
          limit: actionUtil.parseLimit(req),
          sort: actionUtil.parseSort(req)
        });

      requestGamesHistory = true;
    }

    query.exec(function found (err, matchingRecords) {
      if (err) return res.serverError(err);

      if (req._sails.hooks.pubsub && req.isSocket) {
        Game.subscribe(req, matchingRecords);
        Game.watch(req);
      }

      var returnRecords = [];

      if (requestGamesHistory) {
        try {
          returnRecords = matchingRecords.toJSON();
          return res.ok(returnRecords.games);
        } catch (e) {
          return res.forbidden();
        }
      }

      for (var i = 0; i < matchingRecords.length; i++) {
        var game = matchingRecords[i];

        for (var j = 0; j < game.users.length; j++) {
          if (typeof game.users[j] !== "undefined") {
            if (typeof game.users[j].email !== "undefined") delete game.users[j].email;
          }
        }

        returnRecords.push(game);
      }

      res.ok(returnRecords);
    });
  },

  findOne: function (req, res) {
    var pk = actionUtil.requirePk(req);

    Game.findOne(pk)
      .populate('table')
      .populate('messages')
      .populate('users')
      .exec(function (err, result) {
      if (err) return res.serverError(err);
      if (!result) return res.notFound('No record found with the specified `id`.');

      if (sails.hooks.pubsub && req.isSocket) {
        Game.subscribe(req, result);
      }

      var users = result.users;
      var foundUser = false;

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.email) delete result.email;

        if (req.session.user && user.id === req.session.user.id) {
          foundUser = true;
        }
      }

      var game = result;

      if(!foundUser && (game.status === "idle" || game.status === "countdown") && req.session.user) {
        var params = {
          gameId: game.id,
          userId: req.session.user.id,
          clientSeed: req.session.user.clientSeed
        };

        BingoCardService.countCards(params.gameId, params.userId)
          .then(function (result) {
            if(result <= 0) {
              BingoCardService.generateCards(params)
                .then(function (result) {
                  game.bingoCards.push(result);
                  return res.json(game);
                }, function (err) {
                  return res.serverError("Something went wrong");
                });
            } else {
              return res.json(game);
            }
          });
      } else {
        return res.json(game);
      }
    });
  },

  hardGames: function (req, res) {
    Table.create({
      "minimumPlayers": 2,
      "maximumPlayers": 2,
      "maximumCards": 10,
      "cardPrice": 25000,
      "tableType": "medium"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });
    Table.create({
      "minimumPlayers": 4,
      "maximumPlayers": 100,
      "maximumCards": 10,
      "cardPrice": 50000,
      "tableType": "medium"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 4,
      "maximumPlayers": 100,
      "maximumCards": 10,
      "cardPrice": 100000,
      "tableType": "hard"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 3,
      "maximumPlayers": 100,
      "maximumCards": 10,
      "cardPrice": 250000,
      "tableType": "hard"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {
          Game.publishCreate(game);

          res.ok();
        }
      });
    });
  },

  testData: function (req, res) {

    Table.create({
      "minimumPlayers": 2,
      "maximumPlayers": 2,
      "maximumCards": 10,
      "cardPrice": 1000,
      "tableType": "beginner"
    }).exec(function (err, table) {
      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 4,
      "maximumPlayers": 10,
      "maximumCards": 10,
      "cardPrice": 1000,
      "tableType": "beginner"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 10,
      "maximumPlayers": 100,
      "maximumCards": 10,
      "cardPrice": 1000,
      "tableType": "beginner"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 2,
      "maximumPlayers": 2,
      "maximumCards": 10,
      "cardPrice": 10000,
      "tableType": "medium"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 4,
      "maximumPlayers": 100,
      "maximumCards": 10,
      "cardPrice": 10000,
      "tableType": "medium"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });

    Table.create({
      "minimumPlayers": 2,
      "maximumPlayers": 2,
      "maximumCards": 10,
      "cardPrice": 100000,
      "tableType": "hard"
    }).exec(function (err, table) {

      Game.create({
        table: table.id,
        status: "idle",
        serverSeed: SeedService.generateServerSeed(),
        pattern: PatternService.getRandomPattern()
      }).exec(function (error, game) {
        if (!error) {

          Game.publishCreate(game);

          res.ok();

        }
      });
    });
  }

};
