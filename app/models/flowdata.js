const mongoose = require('mongoose');
const env = require('dotenv').config().parsed
const flowdataStreamHandler = require('../handlers/stream/flowdata.js')

const Schema = mongoose.Schema;

const FlowdataSchema = new Schema({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    flowRate: {
        type: Number,
        required: true
    }
});

const FlowdataModel = mongoose.model('flowdata', FlowdataSchema)

if(env.DB_IS_REPLICA_SET === 'true'){
    FlowdataModel.watch().on('change', flowdataStreamHandler.invoker())
}

module.exports = FlowdataModel