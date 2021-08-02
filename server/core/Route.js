class Route {
    constructor({req, res}) {
        this.request = req;
        this.response = res;

        this.#result();
    }

    render(args) {
        const TemplateEngine = require("./components/TemplateEngine");
        TemplateEngine.render(args)        
            .then((template) => {
                this.response.status = 200;
                this.response.end(template);
            })
            .catch(e => {
                this.response.status = 404;
                this.response.end(JSON.stringify(e, null, 2));
            });
    }

    result() {}

    #result() {
        /*
        * TODO: DO SOME INSIDE METHODS HERE
        * */
    }
}

module.exports = Route;
