class ServerResponseProps {
    constructor(res) {
        this.res = res;
        this.ended = false;
    }

    showError(code = 404, msg = "404 NOT FOUND") {
        this.statusCode = code;
        this.end(msg);
    }

    LocalRedirect(url = '/') {
        this.statusCode = 301;
        this.setHeader('Location', url);
    }

    end(...args) {
        if (this.ended) {
            return;
        }

        this.ended = true;
        this._end(...args);
    }

    init() {
        this.res.ended = false;
        this.res._end = this.res.end;
        this.res.end = this.end;
        this.res.LocalRedirect = this.LocalRedirect;
        this.res.showError = this.showError;
        this.res.templates = require('./components/TemplateEngine');

        return this.res
    }
}

module.exports = ServerResponseProps;
