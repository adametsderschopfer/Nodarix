
const ThreadControl = require('./core/components/ThreadControl');
const CDTOChecker = require('./core/components/DTOChecker');

class Bootstrap {
    static init() {
        // require('http').createServer((req, res) => {
        //
        // }).listen(__CONFIG.PORT)
        /**
         *
         * HTTP module
         * SUBDOMAIN module
         *
         * FOLDER REQUEST module
         *
         *
         * ROUTING HANDLER module
         *
         * NDO (NODE.js Data Object) module
         *
         * */

        ThreadControl.clusterize(() => {

        });
    }
}

// console.log(new (require('./core/components/TemplateEngine'))({ engine: require('ejs')}))

module.exports = Bootstrap.init;
