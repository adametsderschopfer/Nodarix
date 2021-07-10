class Bootstrap {
    static init() {
        require('./core/components/ThreadControl').clusterize(() => {
            class ConfiguredHttpServer extends Core.HTTPServer {
                constructor() {
                    super({
                        vars: ConfiguredHttpServer.vars,
                        listenCallback: ConfiguredHttpServer.listenCallback,
                    });
                }

                static get vars() {
                    return {
                        config: {
                            PORT: __CONFIG.PORT,
                        },
                    }
                }

                static getEvents() {
                    return require('./Events');
                }

                static getTemplateEngine() {
                    return require('./core/components/TemplateEngine');
                }

                async beforeInit() {
                    ConfiguredHttpServer.getEvents();

                    return new Promise((res, rej) => {
                        // connect to DB
                        res();
                    })
                }

                async afterInit() {
                    return new Promise((fulfilled, rej) => {
                        super.listen()
                        // serverInstance.on('request', () => {
                        // })
                        // init router here
                        fulfilled();
                    });
                }

                async beforeHandleStart(req, res) {
                    res.templateEngine = ConfiguredHttpServer.getTemplateEngine();


                    // InitEvents
                    // direct the router                              
                }

                static listenCallback() {
                    console.log('[MODULE::HTTPServer] => Server started on port - ' + ConfiguredHttpServer.vars.config.PORT);
                }
            }

            new ConfiguredHttpServer();
        });                       
    }
}

module.exports = Bootstrap.init;
