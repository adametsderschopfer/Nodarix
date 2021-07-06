const {define} = require('./utils');

define('Logger', require('./components/Logger'));

new (require('./ConfigLoader'))();

module.exports = { }
