const cron = require('node-cron');
const appointment = require('./model/Appointment');
const mongoose = require('mongoose');
const user = require('./model/User');



 cron.schedule('*/10 * * * * *', async () => {

    const list = await appointment.find({startDate:{
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
    } }).populate('user');



    console.log('List', list);
    console.log('Running Cron Job');
});