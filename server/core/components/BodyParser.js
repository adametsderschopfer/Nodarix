const qs = require("querystring");
const multiparty = require('multiparty');

class BodyParser {
    constructor({req, res}) {
        this.req = req;
        this.res = res;
    }

    process() {
        return new Promise((fulfilled, rej) => {
            let preBody = "";

            if (/multipart/.test(this.req.headers['content-type'])) {
                const data = new multiparty.Form();

                data.parse(this.req, (err, fields, files) => {
                    if (!err) {
                        this.req.$_BODY = fields;
                        this.req.$_FILES = files.upload.filter(i => i.size);
                    }

                    fulfilled();
                });
                return;
            }

            this.req.on("data", (_body) => {
                preBody = _body;

                if (_body.length > 1e7) {
                    _body.writeHead(413, "Request Entity Too Large", {
                        "Content-Type": "text/html",
                    });
                    _body.end(
                        "<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>"
                    );
                    rej();
                }
            });

            this.req.on("end", () => {
                switch (true) {
                    case /x-www-form-urlencoded/.test(this.req.headers['content-type']): {
                        this.req.$_BODY = { ...qs.parse(preBody.toString()) };
                        break;
                    }

                    case /application\/json/.test(this.req.headers['content-type']): {
                        try {
                            this.req.$_BODY = JSON.parse(preBody.toString())
                        } catch (e) {
                        }
                    }
                }

                fulfilled();
            });
        })
    }
}

module.exports = BodyParser;
