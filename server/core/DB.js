class DB {
    constructor() {


        if (DB.init) {
            return DB.instance;
        }

        DB.instance = this;
        DB.init = true;
    }


}

module.exports = DB;
