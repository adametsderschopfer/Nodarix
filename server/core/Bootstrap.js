class Bootstrap {
    static beforeInit(cb = function (){}) {
        return cb;
    }

    static init() {
        require('./core');

        require('./components/ThreadControl').clusterize(() => {
            const ServerResponseProps = require('./ServerResponseProps');
            const Helper = require("./Helper");
            const StaticFiles = require("./components/StaticFiles");
            const BodyParser = require("./components/BodyParser");

            class HttpServer extends Core.HTTPServer {
                static getEvents() {
                    return require('../Events');
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
                    await Helper.executeAsyncOrNotFunction(Bootstrap.beforeInit());
                }

                async afterInit(serverInstance) {
                    HttpServer.getEvents().subscribeOnEvents(serverInstance);
                    super.listen();
                }

                async beforeHandleStart(req, res) {
                    const url = "http://" + req.headers.host;
                    const {searchParams} = new URL(url + req.url);

                    res = new ServerResponseProps(res).init();
                    req.$_QUERY = Helper.getQueryParams(searchParams);
                    req.$_BODY = {};
                    req.$_FILES = [];

                    if (/[http:\/\/|https:\/\/]static/.test(url) || req.url.replace('\/', "").split("\/")[0] === (__CONFIG.STATIC_DIR || "static")) {
                        new StaticFiles({req,res}).process();
                        return;
                    }

                    if (req.method !== 'GET') {
                        await new BodyParser({req, res}).process();
                    }

                    await HttpServer.getRouterModules().init({req, res, url});
                }

                static listenCallback() {
                    console.log('[MODULE::HTTPServer] => Server started on port - ' + HttpServer.vars.config.PORT);
                }
            }

            new HttpServer();
        });
    }
}

module.exports = Bootstrap;
