class ServerResponseProps {
    constructor(res) {
        this.res = res;
    }

    showError(url) {
        this.statusCode = 404;
        this.end("404 NOT FOUND");
    }

    redirect(url, code = 200) {
        this.res.end('error!')
    }

    init() {
        this.res.redirect = this.redirect;
        this.res.showError = this.showError;

        return this.res
    }
}

module.exports = ServerResponseProps;
