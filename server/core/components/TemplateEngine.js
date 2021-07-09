const path = require('path');

/*
 * Created by: Adamets Vladislav
 * Version: 2.0.0
 * */

class TemplateEngine {
    #engine = undefined;
    #state = {};
    
    constructor({engine} = { engine: undefined }) {
        this.#engine = engine;
        this.templatesPath = path.join(__CONFIG.root + '/Templates/');
    }

    changeLoadStackState(data = {}) {
        Object.assign(this.#state, data);
    }

    render(filename = '', data, options, cb) {
        if (!this.#engine) {
            throw new ReferenceError('Current template engine is undefined');
        }

        this.#engine?.renderFile(path.join(this.templatesPath + filename), Object.assign(data, this.#state), options, cb);
    }

    render_string(str, data, options) {
        if (!this.#engine) {
            throw new ReferenceError('Current template engine is undefined');
        }

        this.#engine?.renderFile(str, data, options);
    }
}

module.exports = TemplateEngine;
