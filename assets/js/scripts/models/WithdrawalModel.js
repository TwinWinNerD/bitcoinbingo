App.Withdrawal = DS.Model.extend({
    recipientAddress: DS.attr(),
    amount: DS.attr(),
    withdrawalType: DS.attr(),
    user: DS.belongsTo('user')
});