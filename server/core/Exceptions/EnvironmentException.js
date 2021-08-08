class EnvironmentException extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'EnvironmentException';
    }
}

module.exports = EnvironmentException;
