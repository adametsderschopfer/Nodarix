function define(key, value) {
    if (!key) {
        throw new SyntaxError('invalid key for define property in global')
    }

    if (!value) {
        throw new SyntaxError('invalid value for define property: ['+ key +'] in global')
    }

    Object.assign(global, {
        [key]: value
    });
}

module.exports = {
    define
};
