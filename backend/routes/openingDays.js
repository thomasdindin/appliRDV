// routes/openingDays.js
const express = require('express');
const router = express.Router();
const OpeningDay = require('../model/Schedule');
const authenticate = require('../middleware/auth');

// GET /openingDays => Tout le monde peut consulter
router.get('/', async (req, res) => {
    try {
        const days = await OpeningDay.find();
        res.json(days);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /openingDays/:dayOfWeek => ...
router.get('/:dayOfWeek', async (req, res) => {
    try {
        const dayOfWeek = parseInt(req.params.dayOfWeek, 10);
        const dayConfig = await OpeningDay.findOne({ dayOfWeek });
        if (!dayConfig) {
            return res.status(404).json({ message: "Jour non trouvé" });
        }
        res.json(dayConfig);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST => création
router.post('/', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé" });
        }
        const { dayOfWeek, name, shifts, services } = req.body;
        const newDay = new OpeningDay({ dayOfWeek, name, shifts, services });
        const saved = await newDay.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT => mise à jour
router.put('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé" });
        }
        const { dayOfWeek, name, shifts, services } = req.body;
        const updated = await OpeningDay.findByIdAndUpdate(
            req.params.id,
            { dayOfWeek, name, shifts, services },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Jour non trouvé' });
        }
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE => ...
router.delete('/:id', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Accès refusé" });
        }
        const deleted = await OpeningDay.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Jour non trouvé' });
        }
        res.json({ message: 'Jour supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
