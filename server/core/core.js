const {define} = require('./utils');
const CEnvironment = require('./Modules/CEnvironment')

define('Logger', require('./components/Logger'));
define('CConfig', require('./Modules/CConfig'))
define('CHelper', require('./Modules/CHelper'))

define('Core', Object.create({
    HTTPServer: require('./HTTPServer'),
    Route: require('./Route'),
    RouterList: require('./RouterList'),
    RouterFactory: require('./RouterFactory'),
}));

define('CLocalCache', require('./Modules/CLocalCache'))
define('CDTOValidator', require('./Modules/CDTOValidator'))
define('CEnvironment', new CEnvironment())
define('CDatabase', require('./Modules/CDatabase'))
define('CFile', require('./Modules/CFile'))
define('CAgent', require('./Modules/CAgent'));

 
                              
