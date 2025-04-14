const express = require('express');
const router = express.Router();
const { verifyToken, canEditTrip } = require('../middleware/verify-token.js');
const Destination = require('../models/destination.js');
const axios = require('axios');

// Index Route: Get all attractions for a destination
router.get('/trips/:tripId/destinations/:destinationId/attractions', verifyToken, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(destination.attractions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show Route: Get a specific attraction
router.get('/trips/:tripId/destinations/:destinationId/attractions/:attractionId', verifyToken, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const attraction = destination.attractions.id(req.params.attractionId);
        if (!attraction) {
            return res.status(404).json({ message: "Attraction not found" });
        }
        res.status(200).json(attraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Route: Create a new attraction
router.post('/trips/:tripId/destinations/:destinationId/attractions', verifyToken, canEditTrip, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        // Modeled after destination controller
        const attractionData = {
            name: req.body.name,
            location: {
                lat: req.body.location.lat,
                lng: req.body.location.lng,
            },
            address: req.body.address,
            placeId: req.body.placeId,
            visitDate: req.body.visitDate || null,
            cost: req.body.cost,
            notes: req.body.notes,
            isVisited: req.body.notes || false,
        };

        destination.attractions.push(attractionData);
        
        await destination.save();

        res.status(201).json(destination.attractions[destination.attractions.length - 1]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Route: Update an attraction
router.put('/trips/:tripId/destinations/:destinationId/attractions/:attractionId', verifyToken, canEditTrip, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const attraction = destination.attractions.id(req.params.attractionId);
        if (!attraction) {
            return res.status(404).json({ message: "Attraction not found" });
        }
        attraction.set(req.body);
        await destination.save();
        res.status(200).json(attraction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Route: Delete an attraction
router.delete('/trips/:tripId/destinations/:destinationId/attractions/:attractionId', verifyToken, canEditTrip, async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const attraction = destination.attractions.id(req.params.attractionId);
        if (!attraction) {
            return res.status(404).json({ message: "Attraction not found" });
        }
        destination.attractions.pull(req.params.attractionId);
        await destination.save();
        res.status(200).json({ message: "Attraction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 