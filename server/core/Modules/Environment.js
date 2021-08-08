const EnvironmentException = require("../Exceptions/EnvironmentException");
const path = require("path");
const fs = require("fs");

class Environment {
    static ignoreFields = ['root', 'isDev', 'isProd', 'NODE_ENV']

    /**
     * @return Route
     * */
    static getList() {
        return __CONFIG;
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

        fs.writeFile(path.join(__CONFIG.root, "server/config/env/." + __CONFIG.NODE_ENV + '.env'), envObj, 'utf-8', (err) => {
            if (err) {
                throw new EnvironmentException(err.toString());
            }

            Core.ConfigLoader.reload();
        });
    }

    /**
     * method return environment without system vars
     *
     * @return {object}
     * */
    static getConfigWithoutSystemVars() {
        const conf = {...Environment.getList()}

        for (const field of Environment.ignoreFields) {
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

        const obj = Environment.getConfigWithoutSystemVars();

        obj[name] = value;
        Environment.save(Environment.toEnvSyntax(obj));
    }

    /**
     * @param {string} name
     * @return {string}
     * */
    static getEnvByName(name) {
        return Environment.getConfigWithoutSystemVars()[name] || null;
    }

    /**
     * @param {string} name - env name
     * */
    static removeEnvByName(name) {
        if (!name) {
            throw new EnvironmentException("name is not defined");
        }
        const obj = Environment.getConfigWithoutSystemVars();

        delete obj[name];
        Environment.save(Environment.toEnvSyntax(obj));
    }
}

module.exports = Environment;
