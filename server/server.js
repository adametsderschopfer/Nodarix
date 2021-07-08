const core = require('./core/core');

const ThreadControl = require('./core/components/ThreadControl');
const DTOChecker = require('./core/components/DTOChecker');

function bootstrap() {
    ThreadControl.clusterize(() => {
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
    });

    // console.log(new (require('./core/components/TemplateEngine'))({ engine: require('ejs')}))
}

module.exports = bootstrap;
