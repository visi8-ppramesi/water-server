const mongoose = require('mongoose')
const env = require('dotenv').config().parsed
const CONN_STR = env.DB_HOST//'mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/sensor-server?replicaSet=rs0'

module.exports = () => {
    mongoose.Promise = global.Promise;
    
    mongoose.connect(CONN_STR);
    
    mongoose.connection.on('connected', () => {
        console.log(`Mongoose default connection open to ${CONN_STR}`);
    });
    
    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose default connection error: ${err}`);
        process.exit(1);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose default connection disconnected');
    });
    
    mongoose.connection.once('open', () => {
        console.log('Mongoose default connection is open');
    });
    
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}
