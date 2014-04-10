/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

        username: {
            type: 'STRING'
        },

        email: {
            type: 'STRING'
        },

        password: {
            type: 'STRING'
        },

        clientSeed: {
            type: 'STRING'
        },

        bingoCards: {
            collection: 'bingoCard',
            via: 'player'
        },

        deposits: {
            collection: 'deposit',
            via: 'player'
        }

	}

};
