App.Deposit = DS.Model.extend({
    amount: DS.attr(),
    depositType: DS.attr(),
    user: DS.belongsTo('user')
});