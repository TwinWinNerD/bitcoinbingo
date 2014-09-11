App.Chat = DS.Model.extend({
  user: DS.attr(),
  body: DS.attr(),
  type: DS.attr(),
  createdAt: DS.attr()
});