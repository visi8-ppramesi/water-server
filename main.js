const { Server } = require('./server.js')
const cluster = require('cluster')
const { cpus } = require('os')

// const serv = new Server()
// serv.start()

const numCPUs = cpus().length;

if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const serv = new Server()
    serv.start()

    console.log(`Worker ${process.pid} started`);
}