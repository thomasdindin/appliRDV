const express = require('express');
const Appointment = require('../model/Appointment');
const router = express.Router();
const authenticate = require('../middleware/auth');

router.post("/create",authenticate, async (req, res) => {
    const {startDate, endDate, description} = req.body;
    const user = req.user.id;

    console.log(req.user);
    
    const newAppointment = new Appointment({
        user,
        startDate,
        endDate,
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

router.get("/:userId",authenticate, async (req, res) => {
    const userId = req.params.userId;
    const appointments = await Appointment.find({user: userId});
    res.json(appointments);
}
);

module.exports = router;