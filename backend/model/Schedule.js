// models/OpeningDay.js
const mongoose = require('mongoose');

const timeslotSchema = new mongoose.Schema({
    startHour: { type: Number, required: true },
    endHour: { type: Number, required: true },
    capacity: { type: Number, default: 10 },
});

const openingDaySchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },

    shifts : [timeslotSchema],
    services: [timeslotSchema],
});

module.exports = mongoose.model('OpeningDay', openingDaySchema);
