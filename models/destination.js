// models/destination.js
const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        // type: String,
        lat: Number,
        lng: Number,
        // required: true,
    },
    address: {
        type: String,
    },
    placeId: {
        type: String,
    },
    photos: {
        type: [String],  
    },
    notes: {
        type: String,
    },
    visitDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        // type: String,
        lat: Number,
        lng: Number,
        // required: true,
    },
    placeId: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Properly embed attractionsSchema as a subdocument array
    attractions: [attractionSchema],
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;