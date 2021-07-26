class Bootstrap {
    static init() {
        require('./core/components/ThreadControl').clusterize(() => {
            const ServerResponseProps = require('./core/ServerResponseProps');
            const RouterFactory = require("./core/RouterFactory");
            const Helper = require("./core/Helper");
            const StaticFiles = require("./core/components/StaticFiles");
            const path = require("path");

            class HttpServer extends Core.HTTPServer {
                static getEvents() {
                    return require('./Events');
                }

                static getRouterModules() {
                    return require('./Router');
                }

                constructor() {
                    super({
                        vars: HttpServer.vars,
                        listenCallback: HttpServer.listenCallback,
                    });
                }

                static get vars() {
                    return {
                        config: {
                            PORT: __CONFIG.PORT,
                        },
                    }
                }

                async beforeInit() {
                    return new Promise((res, rej) => {
                        // connect to DB
                        res();
                    })
                }

                async afterInit(serverInstance) {
                    HttpServer.getEvents().subscribeOnEvents(serverInstance);
                    super.listen();
                }

                async beforeHandleStart(req, res) {
                    const url = "http://" + req.headers.host;
                    const {searchParams} = new URL(url + req.url);

                    res = new ServerResponseProps(res).init();
                    req.query = Helper.getQueryParams(searchParams);

                    if (/[http:\/\/|https:\/\/]static/.test(url) || req.url.replace('\/', "").split("\/")[0] === (__CONFIG.STATIC_DIR || "static")) {
                        const staticWorker = new StaticFiles({
                            req,
                            res,
                        });

                        staticWorker.process();
                        return;
                    }

                    const routerModules = HttpServer.getRouterModules();

                    if (routerModules instanceof Array && routerModules.length) {
                        const foundRouterModule = routerModules.find(rm => {
                            switch (true) {
                                case /[http:\/\/|https:\/\/]api/.test(url) && rm.subdomain === "api": return rm;
                                case /[http:\/\/|https:\/\/]/.test(url) && rm.subdomain === "": return rm;
                                default: return false;
                            }
                        });

                        if (!foundRouterModule) {
                            res.end("<h1>404 NOT FOUND</h1>");
                            return;
                        }

                        await foundRouterModule.include(req, res);
                    } else if (routerModules instanceof RouterFactory) {
                        routerModules.include(req, res);
                    } else {
                        res.end("<h1>503 ROUTER IS FAILED</h1>");
                    }
                }

                static listenCallback() {
                    console.log('[MODULE::HTTPServer] => Server started on port - ' + HttpServer.vars.config.PORT);
                }
            }

            new HttpServer();
        });
    }
}

module.exports = Bootstrap.init;
