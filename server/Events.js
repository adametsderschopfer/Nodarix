const EventEmitter = require('events');

class EventsEngine extends EventEmitter {
    constructor() {
        super();
    }
}

class Events {
    constructor() {
        this.emitter = new EventsEngine;
    }

    subscribeOnEvents(serverInstance) {
        this.emitter.addListener('WEBHOOK::Test', () => {
            console.log('TEST EVENT')
        });
    }
}

const instance = new Events();

require('./core/utils').define('CEvents', Events);

module.exports = instance;
