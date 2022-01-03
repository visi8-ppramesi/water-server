const mongoose = require('mongoose');
const env = require('dotenv').config().parsed
const locationStreamHandler = require('../handlers/stream/location.js')

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    geocoordinate: {
        type: Object,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    flowdata: [{
        type: Schema.Types.ObjectId,
        ref: 'flowdata'
    }],
    parent: { 
        type: Schema.Types.ObjectId, 
        ref: 'location' 
    },
    locationType: {
        type: String,
    },
    locationStatus: {
        type: String,
        enum: ['ON', 'OFF', 'ERROR'],
        default: 'OFF'
    },
    lastStatusTimestamp: {
        type: Number
    }
}, { timestamps: true });

const LocationModel = mongoose.model('location', LocationSchema)

if(env.DB_IS_REPLICA_SET === 'true'){
    LocationModel.watch().on('change', locationStreamHandler.invoker())
}

module.exports = LocationModel