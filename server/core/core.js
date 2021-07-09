const {define} = require('./utils');

define('Logger', require('./components/Logger'));
define('Core', Object.create({
    HTTPServer: require('./HTTPServer'),
    RouterFactory: require('./RouterFactory'),
    DTOChecker: require('./components/DTOChecker')
}));

new (require('./ConfigLoader'))();
