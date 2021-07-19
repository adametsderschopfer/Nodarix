class Bootstrap {
    static init() {
        require('./core/components/ThreadControl').clusterize(() => {
            const ServerResponseProps = require('./core/ServerResponseProps');

            class HttpServer extends Core.HTTPServer {
                static getEvents() {
                    return require('./Events');
                }

                static getRouterModule() {
                    return require('./Router');
                }

                static getTemplateEngine() {
                    return require('./core/components/TemplateEngine');
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
                    res = new ServerResponseProps(res).init();

                    res.templates = HttpServer.getTemplateEngine();
                    HttpServer.getRouterModule().include(req, res);
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
