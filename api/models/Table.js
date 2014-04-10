/**
 * Table.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        minimumPlayers: {
            type: 'INTEGER'
        },

        maximumPlayers: {
            type: 'INTEGER'
        },

        status: {
            type: 'STRING'
        },

        games: {
            collection: 'game',
            via: 'table'
        }

	}

};
