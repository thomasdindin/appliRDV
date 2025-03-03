const mongoose = require('mongoose');
const Appointment = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Appointment', Appointment);