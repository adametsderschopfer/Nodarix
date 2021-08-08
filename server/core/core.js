const {define} = require('./utils');

define('Logger', require('./components/Logger'));

define('Core', Object.create({
    ConfigLoader: require('./ConfigLoader'),
    HTTPServer: require('./HTTPServer'),
    FileWriter: require('./components/FileWriter'),
    Environment: require('./Modules/Environment'),
    Helper: require('./Helper'),
    Route: require('./Route'),
    RouterList: require('./RouterList'),
    RouterFactory: require('./RouterFactory'),
    DTOChecker: require('./components/DTOChecker')
}));

define('CDatabase', require('./DB'))

/*
* init modules
* */

require('./Modules/Agent');
