const RouterList = new (require('./RouterList'))();

const routers = RouterList.getRouters();

module.exports = {
    async init({url, req, res}) {
        const failed = () => {
            res.end("<h1>503 ROUTER IS FAILED</h1>");
        }

        if (routers instanceof Array && routers.length) {
            const foundRouterModule = routers.find(rm => new RegExp(String.raw`[http:\\/\\/|https:\\/\\/]${rm?.subdomain}`).test(url));

            if (!foundRouterModule && !(foundRouterModule instanceof Core.RouterFactory)) {
                failed();
                return;
            }

            await foundRouterModule.include(req, res);
        } else {
            failed();
        }
    }
}
