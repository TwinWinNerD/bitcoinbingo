App.Table = DS.Model.extend({
  cardPrice: DS.attr(),
  minimumPlayers: DS.attr(),
  maximumPlayers: DS.attr(),
  maximumCards: DS.attr(),
  tableType: DS.attr(),
  createdAt: DS.attr(),
  updatedAt: DS.attr(),
  games: DS.hasMany('game')
});