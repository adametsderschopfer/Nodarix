class ServerResponseProps {
    constructor(res) {
        this.res = res;
    }

    showError(code = 404, msg = "404 NOT FOUND") {
        this.statusCode = code;
        this.end(msg);
    }

    LocalRedirect(url = '/') {
        this.statusCode = 302;
        this.setHeader('Location', url);
    }

    init() {
        this.res.redirect = this.redirect;
        this.res.showError = this.showError;
        this.res.templates = require('./components/TemplateEngine');

        return this.res
    }
}

module.exports = ServerResponseProps;
