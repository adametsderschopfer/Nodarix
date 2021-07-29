const path = require('path');
const fs = require('fs');

class StaticFiles {
    constructor({ req, res}) {
        this.req = req;
        this.res = res;
        this.staticFilePath = path.join(__CONFIG.root, (/[http:\/\/|https:\/\/]static/.test("http://" + req.headers.host) ? "static" : ""), this.req.url);
    }

    process() {
        fs.lstat(this.staticFilePath, (err, stats) => {
            if (err || !stats.isFile()) {
                this.res.showError();
                return;
            }
            let readStream = fs.createReadStream(this.staticFilePath);

            readStream.on('open', () => {
                readStream.pipe(this.res);
            });

            readStream.on('error', (err) => {
                this.res.showError(404, JSON.stringify(err));
            });
        })
    }
}

module.exports = StaticFiles;
