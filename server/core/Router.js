const RouterListModule = require('./RouterList');
const RouterList = new RouterListModule();
const path = require('path');

const routers = RouterList.getRouters();

module.exports = {
    async init({host, req, res}) {
        const failed = (e = { error: "Y" }) => {
            res.end(`
                <h1>503 ROUTER IS FAILED</h1>
                <br/>
                <pre>${e}</pre> 
            `);
        }
        if (routers instanceof Array && routers.length) {
            const foundRouterModules = routers.filter(rm => new RegExp(String.raw`[http:\\/\\/|https:\\/\\/]${rm?.subdomain}`).test(host));

            if (!foundRouterModules.length) {
                failed();
                return;
            }

            const subdomain = foundRouterModules[0].subdomain;
            const routersBySubdomain = RouterListModule.getRoutersBySubdomain(subdomain);
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
        } else {
            failed();
        }
    }
}
