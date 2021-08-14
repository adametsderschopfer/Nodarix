const EnvironmentException = require("../Exceptions/EnvironmentException");
const path = require("path");
const fs = require("fs");
const {define} = require('../utils');

let isFirst = true;

class CEnvironment {
    path = require('path');
    dotenv = require('../../Libs/dotenv');
    root = process.cwd();

    #obj = {};

    constructor() {
        if (!isFirst) {
            return;
        }

        this.#obj = Object.create({});
        this.reload();
        isFirst = false;
        Logger.info('[MODULE::CEnvironment] => was initialize');
    }

    getVars() {
        return this.#obj;
    }

    reload() {
        try {
            const envs = this.getEnv();

            Object.assign(this.#obj, {
                root: this.root,
                isDev: process.env.NODE_ENV === 'development',
                isProd: process.env.NODE_ENV === 'production',
                NODE_ENV: process.env.NODE_ENV,
                ...envs
            });
        } catch (e) {
            Logger.info('[MODULE::CEnvironment] => something went wrong =>' + JSON.stringify(e));
        }

        if (!isFirst) {
            Logger.info('[MODULE::CEnvironment] => CEnvironment updated');
        }
    }

    getEnv() {
        Logger.info('[MODULE::CEnvironment] => Getting environment...');
        return (this.dotenv.config({path: this.path.join(this.root, `.env`)}).parsed);
    }

    static ignoreFields = ['root', 'isDev', 'isProd', 'NODE_ENV']

    /**
     * @return Route
     * */
    static getList() {
        return CEnvironment.getVars();
    }

    /*
    * method transforms your object in env template
    *
    * @param {string} obj
    * */
    static toEnvSyntax(obj) {
        if (!obj || !(obj instanceof Object) || !Object.keys(obj).length) {
            throw new EnvironmentException("obj is not defined");
        }

        let template = ``;

        for (const objKey in obj) {
            template += `${objKey}=${obj[objKey]}\n`
        }

        return template;
    }

    /**
     * [CAUTION]: correctly use this method, param envObj is the result working function toEnvSyntax,
     * if you include in the param incorrectly value, so you will remove all your env variables
     *
     * @param {string} envObj
     * */
    static save(envObj) {
        if (!envObj || !envObj?.length) {
            throw new EnvironmentException('envObj is not defined');
        }

        fs.writeFile(path.join(CEnvironment.getVars().root, '.env'), envObj, 'utf-8', (err) => {
            if (err) {
                throw new EnvironmentException(err.toString());
            }

            CEnvironment.reload();
        });
    }

    /**
     * method return environment without system vars
     *
     * @return {object}
     * */
    static getConfigWithoutSystemVars() {
        const conf = {...CEnvironment.getList()}

        for (const field of CEnvironment.ignoreFields) {
            delete conf[field];
        }

        return conf;
    }

    /**
     * Set new variable to env config or rewrite exists
     *
     * @param {string} name - new env name
     * @param {string} value - new env value by name
     * */
    static setEnv(name, value) {
        if (!name) {
            throw new EnvironmentException("name is not defined");
        }

        if (!value) {
            throw new EnvironmentException("value is not defined");
        }

        const obj = CEnvironment.getConfigWithoutSystemVars();

        obj[name] = value;
        CEnvironment.save(CEnvironment.toEnvSyntax(obj));
    }

    /**
     * @param {string} name
     * @return {string}
     * */
    static getEnvByName(name) {
        return CEnvironment.getConfigWithoutSystemVars()[name] || null;
    }

    /**
     * @param {string} name - env name
     * */
    static removeEnvByName(name) {
        if (!name) {
            throw new EnvironmentException("name is not defined");
        }
        const obj = CEnvironment.getConfigWithoutSystemVars();

        delete obj[name];
        CEnvironment.save(CEnvironment.toEnvSyntax(obj));
    }
}

module.exports = CEnvironment;
