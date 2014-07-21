App.ApplicationController = Ember.Controller.extend({
    chatMessages: function () {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
            sortProperties: ['createdAt'],
            sortAscending: true,
            content: this.get('store').filter('chat', function (message) {
                return message;
            })
        });
    }.property('modelMessages'),

    lastMessages: function() {
        var amountOfMessages, startIndex;

        amountOfMessages = this.get('chatMessages.length');

        if(amountOfMessages > 20) {
            startIndex = amountOfMessages - 20;
        } else {
            startIndex = 0;
        }

        return this.get('chatMessages').toArray().slice(startIndex)
    }.property('chatMessages.[]'),
    actions: {
        sendChatMessage: function () {
            var store = this.store;
            var message = this.get('chatMessage');
            var self = this;

            self.set('chatMessage', '');

            if (message.trim() !== "") {
                var data = {
                    body: message
                };

                socket.post('/api/chat', data, function (result) {
                    if (result && typeof result.error === "undefined") {
                        store.createRecord('chat', result);
                    }
                });
            }
        }
    }
});