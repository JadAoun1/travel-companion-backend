const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token.js");
const Destination = require("../models/destination");
const Trip = require("../models/trip");
const mongoose = require("mongoose");

// New Route: Form for creating a new destination
router.get("/users/:userId/trips/:tripId/destinations/new", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
            return res.status(403).json({ message: "Unauthorized to access this trip" });
        }

        res.status(200).json({ message: "New Destination Form" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a Destination:
router.post("/users/:userId/trips/:tripId/destinations", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
            return res.status(403).json({ message: "You are not authorized to add destinations to this trip" });
        }

        const destination = await Destination.create(req.body);

        trip.destination.push(destination._id);
        await trip.save();

        res.status(201).json(destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Index Route: Get all destinations for a trip
router.get("/users/:userId/trips/:tripId/destinations", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId)
            .populate("destination travellers");

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(traveller => traveller._id.equals(req.user._id))) {
            return res.status(403).json({ message: "You are not authorized to view destinations for this trip" });
        }

        res.status(200).json(trip.destination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show Route: Show a specific destination
router.get("/users/:userId/trips/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
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
router.put("/users/:userId/trips/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
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
router.delete("/users/:userId/trips/:tripId/destinations/:destinationId", verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
            return res.status(403).json({ message: "You are not authorized to delete this destination" });
        }

        const deletedDestination = await Destination.findByIdAndDelete(req.params.destinationId);

        if (!deletedDestination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        const destinationIndex = trip.destination.findIndex(destId => destId.toString() === req.params.destinationId);
        if (destinationIndex > -1) {
            trip.destination.splice(destinationIndex, 1);
        }
        await trip.save();

        res.status(200).json(deletedDestination);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 

// Below is a code graveyard for all my reverted changed. There were route conflicts that I tried to fix but still wasn't having luck. I then commented it all out, found a previous version of Jad's working destination routes, and added it above. Tested and working! Leaving the code below because I'm nervous about losing it.

// const express = require("express");
// // const router = express.Router();
// // Updating to merge routes so that we can access params
// const router = express.Router({ mergeParams: true });

// const verifyToken = require("../middleware/verify-token.js");
// const Destination = require("../models/destination");
// const Trip = require("../models/trip");
// const mongoose = require("mongoose");

// // New Route: Form for creating a new destination
// // router.get("/trips/:tripId/destinations", verifyToken, async (req, res) => {
// //     try {
// //         const trip = await Trip.findById(req.params.tripId);
// //         if (!trip) {
// //             return res.status(404).json({ message: "Trip not found" });
// //         }

// //         if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
// //             return res.status(403).json({ message: "Unauthorized to access this trip" });
// //         }

// //         res.status(200).json({ message: "New Destination Form" });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // Create a Destination:
// router.post("/", verifyToken, async (req, res) => {
//     try {
//         const trip = await Trip.findById(req.params.tripId);
//         console.log(req.params.tripId)

//         if (!trip) {
//             return res.status(404).json({ message: "Trip not found" });
//         }

//         if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
//             return res.status(403).json({ message: "You are not authorized to add destinations to this trip" });
//         }

//         const destination = await Destination.create(req.body);

//         trip.destination.push(destination._id);
//         await trip.save();

//         res.status(201).json(destination);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Index Route: Get all destinations for a trip
// router.get("/", verifyToken, async (req, res) => {
//     console.log("🔥 GET /destinations route hit");
//     console.log("tripId:", req.params.tripId);
//     try {
//         const trip = await Trip.findById(req.params.tripId)
//             .populate("destination travellers");

//         if (!trip) {
//             // Updated to a more clear error message.
//             return res.status(404).json({ message: "Looks like you haven't added any destinations yet!" });
//         }

//         if (!trip.travellers.some(traveller => traveller._id.equals(req.user._id))) {
//             return res.status(403).json({ message: "You are not authorized to view destinations for this trip" });
//         }

//         res.status(200).json(trip.destination);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Show Route: Show a specific destination
// router.get("/:destinationId", verifyToken, async (req, res) => {
//     try {
//         const trip = await Trip.findById(req.params.tripId);

//         if (!trip) {
//             return res.status(404).json({ message: "Trip not found" });
//         }

//         if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
//             return res.status(403).json({ message: "You are not authorized to view this destination" });
//         }

//         const destination = await Destination.findById(req.params.destinationId);

//         if (!destination) {
//             return res.status(404).json({ message: "Destination not found" });
//         }

//         res.status(200).json(destination);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Update Route: Update a destination
// router.put("/:destinationId", verifyToken, async (req, res) => {
//     try {
//         const trip = await Trip.findById(req.params.tripId);

//         if (!trip) {
//             return res.status(404).json({ message: "Trip not found" });
//         }

//         if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
//             return res.status(403).json({ message: "You are not authorized to update this destination" });
//         }

//         const updatedDestination = await Destination.findByIdAndUpdate(
//             req.params.destinationId,
//             req.body,
//             { new: true }
//         );

//         if (!updatedDestination) {
//             return res.status(404).json({ message: "Destination not found" });
//         }

//         res.status(200).json(updatedDestination);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Delete Route: Delete a destination
// router.delete("/:destinationId", verifyToken, async (req, res) => {
//     try {
//         const trip = await Trip.findById(req.params.tripId);

//         if (!trip) {
//             return res.status(404).json({ message: "Trip not found" });
//         }

//         if (!trip.travellers.some(travellerId => travellerId.equals(req.user._id))) {
//             return res.status(403).json({ message: "You are not authorized to delete this destination" });
//         }

//         const deletedDestination = await Destination.findByIdAndDelete(req.params.destinationId);

//         if (!deletedDestination) {
//             return res.status(404).json({ message: "Destination not found" });
//         }

//         const destinationIndex = trip.destination.findIndex(destId => destId.toString() === req.params.destinationId);
//         if (destinationIndex > -1) {
//             trip.destination.splice(destinationIndex, 1);
//         }
//         await trip.save();

//         res.status(200).json(deletedDestination);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// module.exports = router;