const express = require('express')
const router = require('./config/router.js')
const db = require('./config/database')
const http = require('http')
const socket = require('socket.io')

// const MongoClient = require('mongodb').MongoClient

class Server{
    constructor(){
        this.app = express()
        this.server = http.Server(this.app)
        this.socket = socket(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            }
        })

        this.app.use(express.json());
        this.app.use(express.urlencoded({
          extended: true
        }));

        this.app.use((req, res, next) => {
            req.socket = this.socket
            next()
        })

        this.app.use(function(req, res, next) {
            res.setHeader("Content-Type", "application/json");
            next();
        });

        router(this.app)
        db()
        
        // this.app.get('/', function(req, res){
        //     res.end(JSON.stringify({status: 'ok'}))
        // })
    }

    async start(){
        this.server.listen(3000, function() {
            console.log('listening on 3000')
        })
    }
}

module.exports.Server = Server

// const express = require('express');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
// const helmet = require('helmet');
// const log = require('winston');
// const env = require('./config/env');

// const app = express();

// app.use(helmet());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// require('./config/routes')(app);
// require('./config/mongoose');

// app.set('port', env.port);
// app.listen(app.get('port'), () => log.info(`Express server worker listening on port ${app.get('port')}`));