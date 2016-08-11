module.exports = function(){
    switch (process.env.NODE_ENV) {
        case 'production':
            var environment = process.env.NODE_ENV;
        default:
            var environment = 'development';
    }
    var config = require('./config.json')[environment];
    config['environment'] = environment;
    return config;
}