const express = require('express');
const Appointment = require('../model/Appointment');
const router = express.Router();

router.post("/create", async (req, res) => {
    const {user, date, description} = req.body;
    const newAppointment = new Appointment({
        user,
        date,
        description
    });
    try {
        await newAppointment.save();
        res.status(200).send("Appointment created successfully");
    } catch (error) {
        res.status(400).json({error});
    }
}
);

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const appointments = await Appointment.find({user: userId});
    res.json(appointments);
}
);

module.exports = router;