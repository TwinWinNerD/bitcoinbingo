/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

    // Default policy for all controllers and actions
    // (`true` allows public access)
    '*': true,

    UserController: {
        add: true,
        create: true,
        destroy: false,
        find: false,
        findOne: ['isAuthenticated', 'isUser'],
        update: ['isAuthenticated', 'isUser', 'protectedAttributes']
    },

    BingoCardController: {
        add: false,
        create: ['isAuthenticated'],
        destroy: false,
        find: false,
        findOne: false,
        update: false
    },

    DepositController: {
        add: false,
        create: false,
        destroy: false,
        find: ['isAuthenticated', 'belongsToUser'],
        findOne: false,
        update: false
    },

    GameController: {
        add: false,
        create: false,
        destroy: false,
        find: true,
        findOne: true,
        update: false
    },

    MessageController: {
        add: false,
        create: ['isAuthenticated'],
        destroy: false,
        find: false,
        findOne: false,
        update: false
    },

    TableController: {
        add: false,
        create: false,
        destroy: false,
        find: false,
        findOne: false,
        update: false
    },
};