const RouterListModule = require('./RouterList');
const path = require('path');

module.exports = {
    async init({host, req, res}) {
        let listName = "RouterList";
        let RouterList = null;
        let routers = [];

        const failed = (e = { error: "Y" }) => {
            res.end(`
                <h1>503 ROUTER IS FAILED</h1>
                <br/>
                <pre>${JSON.stringify(e, null, 2)}</pre> 
            `);
        }

        const subdomainTemp = t => new RegExp(String.raw`[http:\\/\\/|https:\\/\\/]${t}`);

        if (subdomainTemp('admin').test(host)) {
            listName = 'AdminRouterList';
        }

        RouterList = new RouterListModule(listName);
        routers = RouterList.getRouters();

        if (routers instanceof Array && routers.length) {
            const foundRouterModules = routers.filter(rm => subdomainTemp(rm?.subdomain).test(host));

            if (!foundRouterModules.length) {
                failed({ error: "router module is not found" });
                return;
            }

            const subdomain = foundRouterModules[0].subdomain;
            const routersBySubdomain = RouterListModule.getRoutersBySubdomain(subdomain, listName);
            const _url = CHelper.normalizeUrlSlashes(req.url);
            let resultModuleID = null;

            for (const routerStructure of routersBySubdomain) {
                let flag = false;

                if (routerStructure.routes.length) {
                    for (const routeStructure of routerStructure.routes) {
                        if (routeStructure.pathLink === _url) {
                            resultModuleID = routerStructure.id;
                            flag = true;
                            break;
                        }
                    }
                }

                if (flag) {
                    break;
                }
            }

            if (!resultModuleID) {
                if (routersBySubdomain[0] && routersBySubdomain[0]?.pathToErrorPage) {
                    try {
                        require(path.join(__dirname, '../Routing/' + routersBySubdomain[0]?.pathToErrorPage)).include(req, res);
                    } catch (e) {
                        failed(e);
                    }
                } else {
                    failed();
                }
            }

            for (const router of foundRouterModules) {
                if (router.id === resultModuleID) {
                    if (router instanceof Core.RouterFactory) {
                        await router.include(req, res);
                    } else {
                        console.warn("One of router is not RouterFactory constructor => " + router.toString());
                    }

                    break;
                }
            }
        }
        else {
            failed({ error: "routers is not found" });
        }
    }
}
