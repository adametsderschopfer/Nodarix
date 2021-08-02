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

module.exports = new Events();
