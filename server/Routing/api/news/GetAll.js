class NewsGetAll extends Core.Route {
    constructor(arg) {
        super(arg);
    }

    async result() {
        this.render("/header.ejs");
    }
}

module.exports = NewsGetAll;
