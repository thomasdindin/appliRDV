const mongoose = require('mongoose');
const Bookings = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, required: true},
    customers: {type: Number, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Bookings', Bookings);