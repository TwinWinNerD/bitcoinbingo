socket = io.connect();

window.App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true
});

App.ApplicationAdapter = DS.SailsSocketAdapter.extend({
    namespace: '/api',
    log: true
});

App.Router.map(function () {
    this.resource('games', { path: '/' });
    this.resource('game', { path: '/game/:game_id' });
});

App.Game = DS.Model.extend({
    serverSeed: DS.attr(),
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    gameStatus: DS.attr(),
    table: DS.belongsTo('table'),
    bingoCards: DS.hasMany('bingoCard')
});

App.Table = DS.Model.extend({
    createdAt: DS.attr(),
    updatedAt: DS.attr(),
    games: DS.hasMany('game')
});

App.BingoCard = DS.Model.extend({
    clientSeed: DS.attr(),
    game: DS.belongsTo('game')
});

App.GamesRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('game');
    }
});

App.GamesController = Ember.ArrayController.extend({
    itemController: 'game'
});

App.GameController = Ember.ObjectController.extend({

    idle: function () {
        if(this.get('model.gameStatus') === 'idle') {
            return true;
        }
        return false;
    }.property('model.gameStatus'),

    playing: function () {
        if(this.get('model.gameStatus') === 'playing') {
            return true;
        }
        return false;
    }.property('model.gameStatus')
});


    App.ApplicationSerializer = DS.RESTSerializer.extend({
        /**
         The current ID index of generated IDs
         @property
         @private
         */
        _generatedIds: 0,

        /**
         Sideload a JSON object to the payload

         @method sideloadItem
         @param {Object} payload   JSON object representing the payload
         @param {subclass of DS.Model} type   The DS.Model class of the item to be sideloaded
         @param {Object} item JSON object   representing the record to sideload to the payload
         */
        sideloadItem: function(payload, type, item){
            var sideloadKey = type.typeKey.pluralize(),     // The key for the sideload array
                sideloadArr = payload[sideloadKey] || [],   // The sideload array for this item
                primaryKey = Ember.get(this, 'primaryKey'), // the key to this record's ID
                id = item[primaryKey];

            // Missing an ID, generate one
            if (typeof id == 'undefined') {
                id = 'generated-'+ (++this._generatedIds);
                item[primaryKey] = id;
            }

            // Don't add if already side loaded
            if (sideloadArr.findBy("id", id) != undefined){
                return payload;
            }

            // Add to sideloaded array
            sideloadArr.push(item);
            payload[sideloadKey] = sideloadArr;
            return payload;
        },

        /**
         Extract relationships from the payload and sideload them. This function recursively
         walks down the JSON tree

         @method sideloadItem
         @param {Object} payload   JSON object representing the payload
         @paraam {Object} recordJSON   JSON object representing the current record in the payload to look for relationships
         @param {Object} recordType   The DS.Model class of the record object
         */
        extractRelationships: function(payload, recordJSON, recordType){

            // Loop through each relationship in this record type
            recordType.eachRelationship(function(key, relationship) {
                var related = recordJSON[key], // The record at this relationship
                    type = relationship.type;  // belongsTo or hasMany

                if (related){

                    // One-to-one
                    if (relationship.kind == "belongsTo") {
                        // Sideload the object to the payload
                        this.sideloadItem(payload, type, related);

                        // Replace object with ID
                        recordJSON[key] = related.id;

                        // Find relationships in this record
                        this.extractRelationships(payload, related, type);
                    }

                    // Many
                    else if (relationship.kind == "hasMany") {

                        // Loop through each object
                        related.forEach(function(item, index){

                            // Sideload the object to the payload
                            this.sideloadItem(payload, type, item);

                            // Replace object with ID
                            related[index] = item.id;

                            // Find relationships in this record
                            this.extractRelationships(payload, item, type);
                        }, this);
                    }

                }
            }, this);

            return payload;
        },


        /**
         Overrided method
         */
        extractArray: function(store, type, payload, id, requestType) {
            var typeKey = type.typeKey,
                typeKeyPlural = typeKey.pluralize(),
                newPayload = {};

            newPayload[typeKeyPlural] = payload;

            payload = newPayload;

            // Many items (findMany, findAll)
            if (typeof payload[typeKeyPlural] != "undefined"){
                payload[typeKeyPlural].forEach(function(item, index){
                    this.extractRelationships(payload, item, type);
                }, this);
            }


            for(var key in payload) {
                if(key === typeKeyPlural) {
                    for(var i =0; i < payload[key].length; i++) {
                        if(typeof payload[key][i] !== 'object') {
                            delete payload[key][i];
                        }
                    }

                }
            }

            console.log(payload);

            return this._super(store, type, payload, id, requestType);
        },

        extractSingle: function (store, type, payload, id, requestType) {
            var typeKey = type.typeKey,
                typeKeyPlural = typeKey.pluralize(),
                newPayload = {};

            if(!payload[typeKey]) {
                newPayload[typeKey] = payload;
                payload = newPayload;


                if (typeof payload[typeKey] != "undefined"){
                    this.extractRelationships(payload, payload[typeKey], type);

                    delete payload[typeKeyPlural];
                }
            }

            return this._super(store, type, payload, id, requestType);
        }
});