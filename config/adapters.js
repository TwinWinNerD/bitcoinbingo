module.exports.adapters = {
    'default': 'mongo',

    mongo: {
        module   : 'sails-mongo',
        url      : process.env.MONGOHQ_URL || 'mongodb://localhost:27017/bitcoinbingo'
    }
};

console.log(process.env.MONGOHQ_URL);