class CAgent {
   static schedule(...args) {
       return require('node-cron').schedule(...args);
   }

   static queueJob(callback) {
       queueMicrotask(callback);
   }
}

module.exports = CAgent;
