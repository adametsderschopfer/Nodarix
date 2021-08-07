class ApiException {
    static async include(req, res) {
        res.templates.changeLoadStackState({errorCode: res.statusCode})
        res.end(await res.templates.render("/404.ejs"))
    }
}

module.exports = ApiException;
