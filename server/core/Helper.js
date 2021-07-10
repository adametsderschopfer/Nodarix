class Helper {
    static checkIsAsyncFunction(fn) {
        return fn && fn.constructor.name === 'AsyncFunction';
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
}

module.exports = Helper;
