App.Message = DS.Model.extend({
  user: DS.attr(),
  body: DS.attr(),
  type: DS.attr(),
  createdAt: DS.attr(),
  game: DS.belongsTo('game')
});