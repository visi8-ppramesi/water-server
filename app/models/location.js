const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model('location', LocationSchema);