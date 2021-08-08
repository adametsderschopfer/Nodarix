class Helper {
    static checkIsAsyncFunction(fn) {
        return fn && fn.constructor.name === 'AsyncFunction';
    }

    static normalizeUrlSlashes(url) {
        const startModifiedURL = url.startsWith('/') ? url : '/' + url;
        return startModifiedURL.endsWith('/') ?  startModifiedURL.replace(/[/]*$/, ''): startModifiedURL;
    }

    static executeAsyncOrNotFunction(fn) {
        return new Promise(async (fulfilled, rej) => {
            try {
                if (fn) {
                    if (Helper.checkIsAsyncFunction(fn)) {
                        const res = await fn();
                        fulfilled(res);
                    } else {
                        const result = fn();

                        if (result instanceof Promise) {
                            await result;
                            fulfilled();
                        } else {
                            fulfilled()
                        }
                    }
                } else {
                    rej(new Error('fn is not a function'));
                }
            } catch (e) {
                rej(e)
            }
        });
    }

    static wrapLikeNotRoute(str = "") {
        return `<${str}>`
    }

    static isES6Class(fn) {
        return /^\s*class/.test(fn.toString());
    }

    static isFunction(fn) {
        return fn && (fn instanceof Function || typeof fn === "function");
    }

    static writeFileLog(str) {

    }

    static getQueryParams(UELQS) {
        const query = {};

        if (!UELQS) {
            throw new TypeError('UELQS is undefined')
        }

        if (UELQS) {
            for (const [key, value] of UELQS) {
                query[key] = value;
            }
        }

        return query;
    }

    static isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (Helper.isObject(target) && Helper.isObject(source)) {
            for (const key in source) {
                if (Helper.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    Helper.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return Helper.mergeDeep(target, ...sources);
    }

    /** str => string like: /:id */
    static isParamKey(str) {
        const pattern = /\/:/;

        if (str.match(pattern) !== null) {
            return {
                "<param>": str.replace(pattern, ''),
            }
        }

        return false;
    }

    static parseUrlPathOfSlashesWithParams(_str) {
        let pathResult = [];

        function localProcessing(str) {
            if (str === "/") {
                return pathResult.push(str)
            }

            const regex = /^\/[a-zA-Z0-9_:]+/;
            const res = str.match(regex);

            if (res !== null) {
                pathResult.push(res[0]);
                localProcessing(str.replace(regex, ''));
            }
        }

        localProcessing(_str);

        return pathResult;
    }

    static checkMethodExists(method) {
        if (!method || typeof method !== "string") {
            throw new Error("method must be a string!");
        }

        switch (method.toUpperCase()) {
            case "GET":
                return true;
            case "POST":
                return true;
            case "PUT":
                return true;
            case "DELETE":
                return true;
            case "HEAD":
                return true;
            case "CONNECT":
                return true;
            case "OPTIONS":
                return true;
            case "TRACE":
                return true;
            case "PATCH":
                return true;
            default:
                return false;
        }
    }
}

module.exports = Helper;
