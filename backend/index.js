const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const database = require('./config');
const user = require('./routes/user');
const appointment = require('./routes/appointment');
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/user', user);

app.use('/appointment', appointment);

// Connect to MongoDB

database.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log(err);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
