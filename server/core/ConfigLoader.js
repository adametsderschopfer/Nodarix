const {define} = require('./utils');

class ConfigLoader {
    path = require('path');
    dotenv = require('../Libs/dotenv');
    root = process.cwd();

    constructor() {
        define('__CONFIG', Object.create({}));

        try {
            const envs = this.getConfigOfEnv();

            Object.assign(global.__CONFIG, {
                root: process.cwd(),
                ...envs
            });
        } catch(e) {       
            Logger.info('[MODULE::ConfigLoader] => something went wrong =>' + JSON.stringify(e));
        }

        Object.assign(global.__CONFIG, {
            root: this.root,
        });

        Logger.info('[MODULE::__CONFIG] => was initialize');
    }


    getConfigOfEnv() {
        const filenameEnv = `.${process.env.NODE_ENV}.env`;

        return (this.dotenv.config({ path: this.path.join(this.root, '/server/config/env/', filenameEnv) }).parsed);
    }                     
}

module.exports = ConfigLoader;
