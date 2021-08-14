class HttpBasicAuthorization {
    static auth(req, res) {
        const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
        const [login, password] = Buffer.from(b64auth, "base64")
            .toString()
            .split(":");

        if (
            login &&
            password &&
            login === CEnvironment.getVars().HTTP_BASIC_AUTH_LOGIN &&
            password === CEnvironment.getVars().HTTP_BASIC_AUTH_PASSWORD
        ) {
            return Promise.resolve();
        }

        res.writeHead(401, { "WWW-Authenticate": 'Basic realm="nope"' });
        res.end("<h1>Access denied...</h1>");

        return Promise.reject();
    }
}

module.exports = HttpBasicAuthorization;
