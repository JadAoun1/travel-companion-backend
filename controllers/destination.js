const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Destination = require("../models/destination");
const Trip = require("../models/trip");


// Create a Destination:
router.post("/:tripId/destinations", verifyToken, async (req, res) => {
    try {
        // First find the trip to verify ownership
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is one of the travellers
        if (!trip.travellers.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to add destinations to this trip" });
        }

        // Create the destination
        const destination = await Destination.create(req.body);

        // Update the trip with the new destination
        trip.destination = destination._id;
        await trip.save();

        res.status(201).json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Index Route: Get all destinations for a trip
router.get("/:tripId/destinations", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId)
            .populate("destination");

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is one of the travellers
        if (!trip.travellers.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to view destinations for this trip" });
        }

        res.status(200).json(trip.destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show Route: Show a specific destination
router.get("/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is one of the travellers
        if (!trip.travellers.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to view this destination" });
        }

        const destination = await Destination.findById(req.params.destinationId);

        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Route: Update a destination
router.put("/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is one of the travellers
        if (!trip.travellers.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to update this destination" });
        }

        const updatedDestination = await Destination.findByIdAndUpdate(
            req.params.destinationId,
            req.body,
            { new: true }
        );

        if (!updatedDestination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        res.status(200).json(updatedDestination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Route: Delete a destination
router.delete("/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if user is one of the travellers
        if (!trip.travellers.includes(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to delete this destination" });
        }

        const deletedDestination = await Destination.findByIdAndDelete(req.params.destinationId);

        if (!deletedDestination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        // Remove the destination reference from the trip
        trip.destination = null;
        await trip.save();

        res.status(200).json(deletedDestination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 