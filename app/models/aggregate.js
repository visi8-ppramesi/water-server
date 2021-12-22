const mongoose = require('mongoose');

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

module.exports = mongoose.model('aggregate', AggregateSchema);