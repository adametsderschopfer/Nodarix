const AuthController = require('../../../Controllers/admin/Auth.js');
const HttpBasicAuthorization = require('../../../Services/HttpBasicAuthorization.js');
const crypto = require('crypto');

class Auth extends Core.Route {
    constructor(arg) {
        super(arg);
    }

    async result() {
        const isSigned = AuthController.isSigned(this.request);

        if (isSigned) {
            this.response.LocalRedirect('/');
            return;
        }

        HttpBasicAuthorization.auth(this.request, this.response)
            .then(() => {
                const hash = crypto.createHash('sha256').digest('hex');

                this.response.writeHead(200, {
                    'Set-Cookie': 'NODARIX_SESSID=' + hash,
                });
                this.response.end();
            })
            .catch(() => {
                if (!isSigned) {
                    this.response.LocalRedirect('/auth');
                }
            });
    }
}

module.exports = Auth;
