const http = require('http');

class HTTPServer {
    vars = undefined;

    constructor(params = {}) {
        if (params.hasOwnProperty('vars') && Object.keys(params.vars).length) {
            this.vars = this.vars || params.vars;
        }

        this.serverInstance = null;

        this.beforeInit = this.beforeInit || params.beforeInit || (async () => {
        });
        this.afterInit = this.afterInit || params.afterInit || (async () => {
        });

        this.beforeHandleStart = this.beforeHandleStart || params.beforeHandleStart || (async () => {
        });
        this.afterHandleStart = this.afterHandleStart || params.afterHandleStart || (async () => {
        });

        this.beforeInit.bind(this);
        this.afterInit.bind(this);
        this.beforeHandleStart.bind(this);
        this.afterHandleStart.bind(this);

        this.listenCallback = params.listenCallback || (() => {
        });

        this.#init();
    }

    async #handle(req, res) {
        try {
            await CHelper.executeAsyncOrNotFunction(this.beforeHandleStart.bind(this, req, res));
            await CHelper.executeAsyncOrNotFunction(this.afterHandleStart.bind(this, req, res));
        } catch (e) {
            console.error(e);
        }
    }

    listen() {
        this.serverInstance.listen(this.vars.config.PORT, this.listenCallback);
    }

    async #init() {
        if (!this.vars?.config?.PORT) {
            throw new Error('PORT IS NOT DEFINED')
        }

        try {
            await CHelper.executeAsyncOrNotFunction(this.beforeInit);
            this.serverInstance = http.createServer(this.#handle.bind(this));
            await CHelper.executeAsyncOrNotFunction(this.afterInit.bind(this, this.serverInstance));
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = HTTPServer
