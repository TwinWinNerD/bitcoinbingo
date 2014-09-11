/**
 * Models
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 */
util = require('util');

module.exports.models = {
  migrate: 'alter',

  connection: 'bitcoinBingoMySQL',

    publishCreate: function(values, req, options) {
        var self = this;

        options = options || {};

        if (!values[this.primaryKey]) {
            return sails.log.error(
                    'Invalid usage of publishCreate() :: ' +
                    'Values must have an `'+this.primaryKey+'`, instead got ::\n' +
                    util.inspect(values)
            );
        }

        if (sails.util.isFunction(this.beforePublishCreate)) {
            this.beforePublishCreate(values, req);
        }

        // If any of the added values were association attributes, publish add or remove messages.
        _.each(values, function(val, key) {

            // If the user hasn't yet given this association a value, bail out
            if (val === null) {
                return;
            }

            var attributes = this.attributes || {};
            var referencedModel = attributes[key] && attributes[key].model;

            // Bail if this attribute isn't in the model's schema
            if (referencedModel) {
                // Get the associated model class
                var ReferencedModel = sails.models[referencedModel.toLowerCase()];
                // Get the inverse association definition, if any
                reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity}) || _.find(ReferencedModel.associations, {model: this.identity});

                if (reverseAssociation) {

                    // If this is a many-to-many association, do a publishAdd for the
                    // other side.
                    if (reverseAssociation.type == 'collection') {
                        console.log(values);
                        ReferencedModel.publishAdd(val, reverseAssociation.alias, values, req, {noReverse:true});
                    }

                    // Otherwise, do a publishUpdate
                    else {
                        var pubData = {};
                        pubData[reverseAssociation.alias] = values[this.primaryKey];
                        ReferencedModel.publishUpdate(val, pubData, req, {noReverse:true});
                    }

                }

            }
        }, this);

        // Ensure that we're working with a plain object
        values = _.clone(values);

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);

        // Blast success message
        sails.sockets.publishToFirehose({

            model: this.identity,
            verb: 'create',
            data: values,
            id: values[this.primaryKey]

        });

        // Publish to classroom
        var eventName = this.identity;
        this.broadcast(this._classRoom(), eventName, {
            verb: 'created',
            data: values,
            id: values[this.primaryKey]
        }, socketToOmit);

        // Also broadcasts a message to the legacy class room (derived by
        // using the `:legacy_v0.9` trailer on the class room name).
        // Uses traditional eventName === "message".
        // Uses traditional message format.
        if (sails.config.sockets['backwardsCompatibilityFor0.9SocketClients']) {
            var legacyData = _.cloneDeep({
                verb: 'create',
                data: values,
                model: self.identity,
                id: values[this.primaryKey]
            });
            var legacyRoom = this._classRoom()+':legacy_v0.9';
            self.broadcast( legacyRoom, 'message', legacyData, socketToOmit );
        }

        // Subscribe watchers to the new instance
        if (!options.noIntroduce) {
            this.introduce(values[this.primaryKey]);
        }

        if (sails.util.isFunction(this.afterPublishCreate)) {
            this.afterPublishCreate(values, req);
        }

    },

    publishAdd: function(id, alias, record, req, options) {


        // Make sure there's an options object
        options = options || {};

        // Enforce valid usage
        var invalidId = !id || _.isObject(id);
        var invalidAlias = !alias || !_.isString(alias);
        var invalidAddedId = !record.id || _.isObject(record.id);
        if ( invalidId || invalidAlias || invalidAddedId ) {
            return sails.log.error(
                    'Invalid usage of ' + this.identity +
                    '`publishAdd(id, alias, idAdded, [socketToOmit])`'
            );
        }

        if (sails.util.isFunction(this.beforePublishAdd)) {
            this.beforePublishAdd(id, alias, record.id, req);
        }

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);


        // In development environment, blast out a message to everyone
        if (sails.config.environment == 'development') {
            sails.sockets.publishToFirehose({
                id: id,
                model: this.identity,
                verb: 'addedTo',
                attribute: alias,
                addedId: record.id,
                record: record
            });
        }

        this.publish(id, this.identity, 'add:'+alias, {
            id: id,
            verb: 'addedTo',
            attribute: alias,
            addedId: record.id,
            record: record
        }, socketToOmit);

        if (!options.noReverse) {

            // Get the reverse association
            var reverseModel = sails.models[_.find(this.associations, {alias: alias}).collection];

            var data;

            // Subscribe to the model you're adding
            if (req) {
                data = {};
                data[reverseModel.primaryKey] = record.id;
                reverseModel.subscribe(req, data);
            }

            var reverseAssociation = _.find(reverseModel.associations, {collection: this.identity}) || _.find(reverseModel.associations, {model: this.identity});

            if (reverseAssociation) {
                // If this is a many-to-many association, do a publishAdd for the
                // other side.
                if (reverseAssociation.type == 'collection') {
                    reverseModel.publishAdd(record.id, reverseAssociation.alias, id, req, {noReverse:true});
                }

                // Otherwise, do a publishUpdate
                else {
                    data = {};
                    data[reverseAssociation.alias] = id;
                    reverseModel.publishUpdate(record.id, data, req, {noReverse:true});
                }
            }

        }


        if (sails.util.isFunction(this.afterPublishAdd)) {
            this.afterPublishAdd(id, alias, record.id, req);
        }

    }
};
