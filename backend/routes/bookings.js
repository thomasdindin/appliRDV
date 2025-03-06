// routes/bookings.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const bookingService = require('../services/bookingsService');

// GET ALL
router.get('/', authenticate, async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings(req.user);
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// CREATE
router.post('/', authenticate, async (req, res) => {
    try {
        const { date, customers } = req.body;

        // date => 2025-03-10T11:00 etc.
        // user => req.user
        const newBooking = await bookingService.createBooking(req.user, date, customers);
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

// UPDATE
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updated = await bookingService.updateBooking(
            req.user,
            req.params.id,
            { date: req.body.date, customers: req.body.customers }
        );
        res.json(updated);
    } catch (error) {
        console.error(error);
        if (error.message === "Accès refusé") {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
});

// DELETE
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await bookingService.deleteBooking(req.user, req.params.id);
        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        console.error(error);
        if (error.message === "Accès refusé") {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
