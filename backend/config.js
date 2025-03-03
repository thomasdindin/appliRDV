const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const database = mongoose.connect(process.env.URL_MONGO)

module.exports = database;