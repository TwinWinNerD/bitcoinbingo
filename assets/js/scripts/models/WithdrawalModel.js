App.Withdrawal = DS.Model.extend({
  recipientAddress: DS.attr(),
  amount: DS.attr(),
  createdAt: DS.attr(),
  withdrawalType: DS.attr(),
  user: DS.belongsTo('user')
});