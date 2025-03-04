const cron = require('node-cron');
const appointment = require('./model/Appointment');
const mongoose = require('mongoose');
const user = require('./model/User');
const sendEmail = require('./mail');
require('dotenv').config();


 cron.schedule('*/10 * * * * *', async () => {

    try {

    const lists = await appointment.find({startDate:{
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
    } }).populate('user');



    console.log('List', lists);

    for (const list of lists) {
        if (list.user && list.user.email) {
            // Contenu du rappel
            const subject = "🔔 Rappel de votre rendez-vous";
            const htmlContent = `
                <h1>Bonjour ${list.user.username},</h1>
                <p>Ceci est un rappel pour votre rendez-vous prévu le <strong>${list.startDate}</strong>.</p>
                <p>Merci et à bientôt !</p>
            `;

            // Envoi de l'email
            await sendEmail(list.user.email, subject, htmlContent);
            console.log(`📩 Email envoyé à ${list.user.email} pour le rendez-vous du ${list.startDate}`);
        }
    }

} catch (error) {
    console.error("❌ Erreur lors de l'envoi des rappels :", error);
}
    console.log('Running Cron Job');
});