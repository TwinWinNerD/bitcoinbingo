App.ApplicationView = Ember.View.extend({
    didInsertElement: function () {
        $('.tooltip-sidebar-toggle, .tooltip-sidebar-logout').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        });

        Ladda.bind('.ladda-button', {
            timeout: 2000
        });
    }
});