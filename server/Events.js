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
        this.emitter.addListener('SERVER:test', () => {
            console.log('TEST STROKE EVENT')
        });
    }
}

module.exports = new Events();
