const mongoose = require('mongoose');

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

module.exports = mongoose.model('flowdata', FlowdataSchema);