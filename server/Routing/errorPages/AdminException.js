class AdminException {
    static async include(req, res) {
        res.end("<h1><i>Something went wrong</i></h1> ");
    }
}

module.exports = AdminException;
           
