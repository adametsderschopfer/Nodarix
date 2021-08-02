const routers = require('./RouterList');

module.exports = {
    async init({url, req, res}) {
        if (routers instanceof Array && routers.length) {
            const foundRouterModule = routers.find(rm => {
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
        } else if (routers instanceof Core.RouterFactory) {
            routers.include(req, res);
        } else {
            res.end("<h1>503 ROUTER IS FAILED</h1>");
        }
    }
}
