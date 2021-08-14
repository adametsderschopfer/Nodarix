class Auth {

    static isSigned(req) {
        return !!req.$_COOKIES?.NODARIX_SESSID && req.$_COOKIES?.NODARIX_SESSID.length;
    }

}

module.exports = Auth;
