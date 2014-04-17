/**
 * Table.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        minimumPlayers: {
            type: 'INTEGER',
            integer: true,
            required: true
        },

        maximumPlayers: {
            type: 'INTEGER',
            integer: true,
            required: true
        },

        cardPrice: {
            type: 'INTEGER',
            integer: true,
            required: true
        },

        tableStatus: {
            type: 'STRING',
            alpha: true,
            required: true
        },

        games: {
            collection: 'game',
            via: 'table'
        }

	}

};
