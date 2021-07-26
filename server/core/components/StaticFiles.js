const path = require('path');
const fs = require('fs');

class StaticFiles {
    constructor({ req, res}) {
        this.req = req;
        this.res = res;
        this.staticFilePath = path.join(__CONFIG.root, this.req.url);
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
                this.res.showError(503, JSON.stringify(err));
            });
        })
    }
}

module.exports = StaticFiles;
