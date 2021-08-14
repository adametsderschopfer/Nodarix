class CDatabase {
    constructor() {
        if (DB.init) {
            return DB.instance;
        }

        this.prismaModule = require('@prisma/client');

        DB.instance = this;
        DB.init = true;
    }

    getInstance() {
        return new this.prismaModule.PrismaClient();
    }
}

module.exports = CDatabase;
