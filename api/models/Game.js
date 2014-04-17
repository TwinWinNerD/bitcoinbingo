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
            notNull: true,
            required: true
        },

        gameStatus: {
            type: 'STRING',
            alpha: true,
            required: true
        },

        bingoCards: {
            collection: 'bingoCard',
            via: 'game'
        },

        table: {
            model: 'table',
            required: true
        },

        winners: {
            collection: 'winner',
            via: 'game'
        }

	}

};
