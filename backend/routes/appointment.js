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

router.get("/user",authenticate, async (req, res) => {
    
    const user = req.user.id;
    try{

    const appointments = await Appointment.find({user: user});
    console.log(`Found appointments: ${appointments}`);
    res.status(200).json(appointments);
} catch (error) {
    res.status(400).json({error});
    console.log(error);
}
}
);

router.get("/details/:id",authenticate, async (req, res) => {
    const appointmentId = req.params.id;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).send("Appointment not found");
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json({error});
    }
}
);

module.exports = router;