class RouterListException extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'RouterListException';
    }
}

module.exports = RouterListException;
