const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;
const RouterListException = require('./Exceptions/RouterListException');
const Helper = require("./Helper");

/**
 * @typedef {{ id?: string, name?: string, subdomain?: string, pathToErrorPage?: string, routes: Array }} Router
 * @typedef {{ id?: string, pathToRoute: string, pathLink: string, method: string }} Route
 * */

/**
 * @class RouterList
 * */
class RouterList {
    constructor() {
        if (RouterList.init) {
            return RouterList.instance;
        }

        RouterList.init = true;
        RouterList.instance = this;

        this.routers = [];
        this.routerList = [];

        this.#init();
    }

    /**
     * Return path to RouterList.json
     *
     * @return string
     * */
    static get pathToRouterList() {
        return path.join(__CONFIG.root, 'server/config', 'RouterList.json');
    }

    getRouters() {
        return this.routers;
    }

    getRouterList() {
        if (this.routerList.length) {
            return this.routerList
        }

        return RouterList.getRouterList();
    }

    /**
     * Return RouterList of config folder
     *
     * @return Array<Router>
     * */
    static getRouterList() {
        return require(RouterList.pathToRouterList);
    }

    /**
     * Save new or exists router
     *
     * @param {Router | Array<Router>} _router
     * @param {boolean} isList
     * @return new RouterListException | boolean
     * */
    static saveRouterList(_router, isList = false) {
        if (!isList && (!_router.id || !_router.routes || !_router.name)) {
            throw new RouterListException('invalid router');
        }

        let routerList = RouterList.getRouterList();
        let hasById = false;
        let hasByName = false;

        if (!isList && RouterList.getRouterByID(_router.id)) {
            routerList = routerList.filter(i => i.id !== _router.id);
            routerList.push(_router);
            hasById = true;
        }

        if (!isList && !hasById && RouterList.getRouterByName(_router.name)) {
            routerList = routerList.filter(i => i.name !== _router.name);
            routerList.push(_router);
            hasByName = true;
        }

        if (!isList && !hasById && !hasByName) {
            routerList.push(_router);
        }

        if (isList) {
            routerList = _router;
        }

        fs.writeFile(RouterList.pathToRouterList, JSON.stringify(routerList, null, 2), (err) => {
            if (err) {
                throw new RouterListException(err.toString());
            }
        });

        return true;
    }

    /**
     * Add new Router in RouterList.json
     *
     * @param {Router} obj
     * @return boolean
     * */
    static addNewRouter({name, subdomain, pathToErrorPage, routes = []} = {}) {
        if (routes && !(routes instanceof Array)) {
            throw new RouterListException('routes should be array type');
        }

        if (name && RouterList.getRouterByName(name)) {
            throw new RouterListException('Router by name ' + name + ' is exists')
        }

        const id = uuid();
        const result = {
            id,
            name: name?.trim() || uuid(),
            subdomain: subdomain?.trim() || "",
            pathToErrorPage: pathToErrorPage?.trim() || "",
            routes: routes.length ? routes.map(RouterList.generateRoute) : routes,
        }

        RouterList.saveRouterList(result);
        return true;
    }

    /**
     * Return router by ID
     *
     * @param {string} _routerID
     * @return Boolean
     * */
    static removeRouter(_routerID) {
        let data = require(RouterList.pathToRouterList);

        if (data && RouterList.getRouterByID(_routerID)) {
            RouterList.saveRouterList(data.filter(i => i.id !== _routerID), true);
            return true;
        }

        return false;
    }

    /**
     * Edit router by ID
     *
     * @param {string} _routerID
     * @param {Router} obj
     * @return Boolean
     * */
    static editRouter(_routerID, {name, subdomain, pathToErrorPage, routes}) {
        const list = RouterList.getRouterList();
        const routerIDX = [...list].map(i => i.id).indexOf(_routerID);

        if (routerIDX !== -1) {
            list[routerIDX]['name'] = name?.trim() || list[routerIDX]['name'];
            list[routerIDX]['subdomain'] = subdomain?.trim() || list[routerIDX]['subdomain'];
            list[routerIDX]['pathToErrorPage'] = pathToErrorPage?.trim() || list[routerIDX]['pathToErrorPage'];
            list[routerIDX]['routes'] = routes || list[routerIDX]['routes'];

            RouterList.saveRouterList(list, true)
            return true;
        }

        return false;
    }

    /**
     * Return router by ID
     *
     * @param {string} _routerID
     * @return Router
     * */
    static getRouterByID(_routerID) {
        return RouterList.getRouterList()?.find(router => router.id === _routerID.trim());
    }

    /**
     * Return routers by subdomain
     *
     * @param {string} subdomain
     * @return Array<Router>
     * */
    static getRoutersBySubdomain(subdomain) {
        return RouterList.getRouterList().filter(router => router.subdomain === subdomain.trim());
    }

    /**
     * Return router by name
     *
     * @param {string} name
     * @return Router
     * */
    static getRouterByName(name) {
        return RouterList.getRouterList().find(router => router.name === name.trim());
    }

    /**
     * Correctly creating route
     *
     * @param {Route} object
     * @return Route
     * */
    static generateRoute({pathToRoute, pathLink, method}) {
        if (pathToRoute && pathLink && method) {

            return ({id: uuid(), method: method.trim(), pathLink: Helper.normalizeUrlSlashes(pathLink).trim(), pathToRoute: pathToRoute.trim()});
        }

        throw new RouterListException('Invalid route: [' + "pathToRoute: " + pathToRoute + " pathLink: " + pathLink + " method: " + method + ']');
    }

    /**
     * Add new route by router id
     *
     * @param {Route} object
     * @param {string} _routerID
     * @return boolean | RouterListException
     * */
    static addNewRoute(_routerID, {pathToRoute, pathLink, method} = {}) {
        if (_routerID && pathToRoute && pathLink && method) {
            const newRoute = RouterList.generateRoute({pathToRoute, pathLink, method});
            const router = RouterList.getRouterByID(_routerID);

            const list = RouterList.getRouterList().filter(i => i.subdomain === router.subdomain);

            for (const item of list) {
                for (const r of item.routes) {
                    if (r.pathLink === pathLink) {
                        throw new RouterListException("Route with path link => " + pathLink + " is exists in the space of subdomain => " + (!router.subdomain.length ? '/' : router.subdomain));
                    }
                }
            }

            if (router) {
                router.routes.push(newRoute);
                RouterList.saveRouterList(router);

                return true;
            } else {
                throw new RouterListException("router not found by " + _routerID);
            }
        } else {
            throw new RouterListException("Invalid arguments");
        }
    }

    /**
     * Remove route by router id and route id
     *
     * @param {string} _routerID
     * @param {string} _routeID
     * @return boolean
     * */
    static removeRoute(_routerID, _routeID) {
        const list = RouterList.getRouterList();
        const routerIDX = [...list].map(i => i.id).indexOf(_routerID);

        if (routerIDX !== -1) {
            list[routerIDX].routes = list[routerIDX].routes.filter(i => i.id !== _routeID);
            RouterList.saveRouterList(list, true);
            return true;
        }
        return false;
    }

    /**
     * Edit route by router id and route id
     *
     * @param {string} _routerID
     * @param {string} _routeID
     * @param {Route} obj
     * @return boolean
     * */
    static editRoute(_routerID, _routeID, {pathToRoute, pathLink, method}) {
        const list = RouterList.getRouterList();
        const routerIDX = [...list].map(i => i.id).indexOf(_routerID);

        if (routerIDX !== -1) {
            if (pathLink) {
                const _list = RouterList.getRouterList().filter(i => i.subdomain === list[routerIDX].subdomain);

                for (const item of _list) {
                    for (const r of item.routes) {
                        if (r.pathLink === pathLink) {
                            throw new RouterListException("Route with path link => " + pathLink + " is exists in the space of subdomain => " + (!list[routerIDX].subdomain.length ? '/' : list[routerIDX].subdomain));
                        }
                    }
                }
            }

            const route = list[routerIDX].routes.find(i => i.id === _routeID);

            if (route) {
                route['pathToRoute'] = pathToRoute || route['pathToRoute'];
                route['pathLink'] = pathLink || route['pathLink'];
                route['method'] = method || route['method'];

                RouterList.saveRouterList(list, true);

                return true;
            }

            return false;
        }

        return false;
    }

    /**
     * Return Route of router by id
     *
     * @param {string} _routerID
     * @param {string} _routeID
     * @return {Router}
     * */
    static getRouteByID(_routerID, _routeID) {
        return RouterList.getRouterByID(_routerID.trim()).routes.find(i => i.id === _routeID.trim());
    }

    #init() {
        const data = this.getRouterList();

        if (data instanceof Array) {
            for (const router of data) {
                this.#create(router);
            }
        }
    }

    /**
     * @param {Router} _router
     * */
    #create(_router) {
        class Router extends Core.RouterFactory {
            constructor(params) {
                super(params);
            }

            async errorHandler(req, res) {
                try {
                    const errorModule = require(path.join(__CONFIG.root, 'server', 'Routing', _router.pathToErrorPage));
                    await errorModule.include(req, res);
                } catch (e) {
                    res.end('400 SOMETHING WENT WRONG');
                }
            }

            declare() {
                if (_router.routes.length) {
                    for (const route of _router.routes) {
                        if (route.method && route.pathLink && route.pathToRoute) {
                            this.register(route.method, route.pathLink, require(path.join(__CONFIG.root, 'server', 'Routing', route.pathToRoute)));
                        }
                    }
                }
            }
        }

        this.routers.push(new Router({
            subdomain: _router.subdomain.length && _router.subdomain || "",
            id: _router.id
        }));
    }
}

module.exports = RouterList;
                                                                                           
