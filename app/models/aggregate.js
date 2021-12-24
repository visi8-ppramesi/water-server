const mongoose = require('mongoose');
const env = require('dotenv').config().parsed
const aggregateStreamHandler = require('../handlers/stream/aggregate.js')

const Schema = mongoose.Schema;

const AggregateSchema = new Schema({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location',
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Number,
        required: true,
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

const AggregateModel = mongoose.model('aggregate', AggregateSchema)

if(env.DB_IS_REPLICA_SET === 'true'){
    AggregateModel.watch().on('change', aggregateStreamHandler.invoker())
}

module.exports = AggregateModel