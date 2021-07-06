const core = require('./core/core');

const ThreadControl = require('./core/components/ThreadControl');
const DTOChecker = require('./core/components/DTOChecker');

function bootstrap() {
    ThreadControl.clusterize(() => {
        // require('http').createServer((req, res) => {
        //
        // }).listen(__CONFIG.PORT)

                         
        class userEntityDTO {
            firstname = {required: true, type: String}
            lastname = {required: false, type: String}
            birthYear = {required: true, type: Number}
            birthDay = {type: [Number, String], required: true}
            someDepthFields = {
                required: true,
                type: Object,

                someDepthFields: {
                    type: Object,
                    someDepthField: {type: [Number, String]},
                    moreDepthField: {
                        type: Object,
                        required: true,
                        key: {
                            type: Boolean,
                            required: true
                        }
                    }
                }
            }
        }

        const userEntity = ({
            firstname: '234',
            lastname: 'Doe',
            birthYear: 1999,
            birthDay: '12',
            someDepthFields: {someDepthField: 123123, moreDepthField: {key: true}}
        });

        const userDTO = new DTOChecker(userEntity, userEntityDTO);
        console.log(userDTO.validate())

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
