module.exports = function(){
    var environment = 'development';
    switch (process.env.NODE_ENV) {
        case 'production':
            environment = process.env.NODE_ENV;
    }
    var config = require('./config.json')[environment];
    config['environment'] = environment;
    return config;
}