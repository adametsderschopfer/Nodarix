class CHelper {
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
                    if (CHelper.checkIsAsyncFunction(fn)) {
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

        if (CHelper.isObject(target) && CHelper.isObject(source)) {
            for (const key in source) {
                if (CHelper.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    CHelper.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return CHelper.mergeDeep(target, ...sources);
    }

    static normalizePathToJS(_path) {
        if (_path.endsWith('.js')) {
           return k.substring(k.length - 3, 0);
        }

        return _path;
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

    static parseCookies (request) {
        var list = {},
            rc = request.headers.cookie;

        rc && rc.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });

        return list;
    }

    static parseUrlPathOfSlashesWithParams(_str) {
        let pathResult = [];

        _str = CHelper.normalizeUrlSlashes(_str);

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

module.exports = CHelper;
