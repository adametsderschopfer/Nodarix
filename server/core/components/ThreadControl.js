class ThreadControl {
    static clusterLib = require('cluster');
    static osLib = require('os');

    static clusterize(clusterizeFunction) {
        const numCPUs = __CONFIG.isDev ? 1 : ThreadControl.osLib.cpus().length;

        if (ThreadControl.clusterLib.isMaster) {
            Logger.info(`[MODULE::ThreadControl] => Master ${process.pid} is running`);

            for (let i = 0; i < numCPUs; i++) {
                ThreadControl.clusterLib.fork();
            }

            ThreadControl.clusterLib.on('exit', (worker) => {
                Logger.info(`[MODULE::ThreadControl] => worker is dead ${worker.isDead()}`);
            });
        } else if (ThreadControl.clusterLib.isWorker) {
            if (clusterizeFunction instanceof Function) {
                clusterizeFunction();
            }
                                       
            Logger.info(`[MODULE::ThreadControl] => Worker ${process.pid} started`);
        }
    }
}

module.exports = ThreadControl;
