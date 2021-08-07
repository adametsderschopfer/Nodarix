class Agent {
   static schedule(...args) {
       return require('node-cron').schedule(...args);
   }

   static queueJob(callback) {
       queueMicrotask(callback);
   }
}

require('../utils').define('CAgent', Agent);

module.exports = Agent;
