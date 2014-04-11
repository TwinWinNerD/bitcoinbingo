/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        serverSeed: {
            type: 'STRING',
            notNull: true
        },

        gameStatus: {
            type: 'STRING'
        },

        bingoCards: {
            collection: 'bingoCard',
            via: 'game'
        },

        table: {
            model: 'table'
        },

        winners: {
            collection: 'winner',
            via: 'game'
        }

	}

};
