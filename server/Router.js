const RouterFactory = require("./core/RouterFactory");

class Router extends RouterFactory {
    constructor(params) {
        super(params);
    }

    async errorHandler(req, res) {
        res.templates.changeLoadStackState({ errorCode: res.statusCode })
        res.end(await res.templates.render("/404.ejs"))
    }

    declare() {
        this.register("GET", "/", (req, res) => {
            res.end(`
                <h1>News</h1>
                <a href="/news">news</a>
            `);

        })
        this.register("GET", "/news", (req, res) => {
            res.end(`
                <h1>News</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, odit!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, odit!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, odit!</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, odit!</p>
            `);

            /*req.params => /news/:detail -> detail as key*/
            /*req.query => query string as object*/
        })  
    }
}

class RouterApi extends RouterFactory {
    constructor(params) {
        super(params);
    }

    declare() {
        this.register("GET", "/news", (req, res) => {
            res.end(JSON.stringify({title: "lorem ipsum"}, null, 2))
        })
    }
}

module.exports = [
    new RouterApi({
        subdomain: "api"
    }),
    new Router({
        SemanticURLs: require('./Routing/SemanticsURL')
    })
];
