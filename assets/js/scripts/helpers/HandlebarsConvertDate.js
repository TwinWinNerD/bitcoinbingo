Ember.Handlebars.helper('convertDateToLocale', function(date) {
    return new Date(date).toLocaleString();
});