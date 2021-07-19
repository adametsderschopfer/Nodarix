class ServerResponseProps {
    constructor(res) {
        this.res = res;
    }

    showError(code = 200) {
        // set status code
        // this.res.end('error!')
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
