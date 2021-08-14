const path = require('path');
const fs = require('fs');

class CFile {
    static saveFile({files = [], pathToSave = "", salt = ""}) {
        const status = { done: false, err: undefined };

        if (!files || !files.length) {
           return status;
        }

        const pathWithStatic = path.join(CEnvironment.getVars().root, "static", pathToSave);

        const __save = (f) => {
            if (f?.path?.length) {
                const is = fs.createReadStream(f.path);
                const os = fs.createWriteStream(pathWithStatic + '\\' + (salt).toString() + f.originalFilename);

                is.pipe(os);
                is.on('end',function() {
                    fs.unlinkSync(files[0].path);
                });
            }
        }

        if (files instanceof Array) {
            if (files.length > 1) {
                for (const f of files) {
                    __save(f);
                }
            } else {
                __save(files[0]);
            }

            status.done = true;
        } else {
            __save(files);
            status.done = true;
        }

        return status;
    }
}

module.exports = CFile;
