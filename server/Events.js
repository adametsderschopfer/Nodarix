const EventEmitter = require('events');

class EventsEngine extends EventEmitter {
    constructor() {
        super();
    }
}

const Events = new EventsEngine;

Events.addListener('SERVER:test', () => {
    console.log('TEST STROKE EVENT')
});
                                   
module.exports = Events;
