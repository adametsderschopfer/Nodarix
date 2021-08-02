const {define} = require('./utils');

define('Logger', require('./components/Logger'));

define('Core', Object.create({
    HTTPServer: require('./HTTPServer'),
    FileWriter: require('./components/FileWriter'),
    Helper: require('./Helper'),
    Route: require('./Route'),
    RouterFactory: require('./RouterFactory'),
    DTOChecker: require('./components/DTOChecker')
}));


new (require('./ConfigLoader'))();
