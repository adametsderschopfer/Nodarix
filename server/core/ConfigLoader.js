const {define} = require('./utils');

let isFirst = true;

class ConfigLoader {
    path = require('path');
    dotenv = require('../Libs/dotenv');
    root = process.cwd();

    constructor() {
        if (!isFirst) {
            return;
        }

        define('__CONFIG', Object.create({}));
        this.reload();
        isFirst = false;
        Logger.info('[MODULE::ConfigLoader] => was initialize');
    }

    reload() {
        try {
            const envs = this.getConfigOfEnv();

            Object.assign(global.__CONFIG, {
                root: this.root,
                isDev: process.env.NODE_ENV === 'development',
                isProd: process.env.NODE_ENV === 'production',
                ...envs
            });
        } catch (e) {
            Logger.info('[MODULE::ConfigLoader] => something went wrong =>' + JSON.stringify(e));
        }

        if (!isFirst) {
            Logger.info('[MODULE::ConfigLoader] => Environment updated');
        }
    }

    getConfigOfEnv() {
        Logger.info('[MODULE::ConfigLoader] => Getting environment...');
        return (this.dotenv.config({path: this.path.join(this.root, '/server/config/env/', `.${process.env.NODE_ENV}.env`)}).parsed);
    }
}

module.exports = new ConfigLoader();
