const RouterFactory = require("./core/RouterFactory");

class Router extends RouterFactory {
    constructor(params) {
        super(params);
    }

    declare() {
        this.register("GET", "/news", (req, res) => {

            res.end('news')
        } )
        this.register("GET", "/news/get", (req, res) => {
            console.log(3)
            res.end('get 1')
        })
        this.register("GET", "/news/:detail", (req, res) => {
            res.end(req.params.detail)
        })                      
                             

        this.register("GET", "/news/get/:detail", (req, res) => {
            console.log(3)
        })


        this.register("GET", "/news/get/:detail/:page", (req, res) => {
            console.log(req.params)
            res.end(JSON.stringify(req.params, null, 2))

        })
    }
}

module.exports = new Router({
    path: require("path").join(__CONFIG.root, "server", "Routing")
});
