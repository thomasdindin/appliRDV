const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const database = require('./config');
const user = require('./routes/user');
const bookingsRoutes = require('./routes/bookings');
const openingDaysRoutes = require('./routes/openingDays');
const OpeningDay = require('./model/Schedule');

dotenv.config();
require('./cronTache.js');

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/user', user);
app.use('/bookings', bookingsRoutes);
app.use('/openingDays', openingDaysRoutes);

async function ensureOpeningDays() {
    const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const existing = await OpeningDay.findOne({ dayOfWeek });
        if (!existing) {
            await OpeningDay.create({
                dayOfWeek,
                name: dayNames[dayOfWeek],
                shifts: [],
                services: []
            });
            console.log(`Created dayOfWeek=${dayOfWeek} in DB`);
        }
    }
}


// Connect to MongoDB

database.then(() => {
    ensureOpeningDays();
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
