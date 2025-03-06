// cronJobs.js
require('dotenv').config(); // charger les variables d'environnement
const cron = require('node-cron');
const { getBookingsForToday } = require('./services/bookingsService'); // adaptez le chemin si nécessaire
const sendEmail = require('./mail'); // module d'envoi d'email

// Planifier le cron job pour 8h00 chaque jour (minute 0, heure 8, tous les jours)
cron.schedule('0 8 * * *', async () => {
    console.log("Début du cron job d'envoi de rappels à 8h00");

    try {
        // Récupérer les réservations d'aujourd'hui
        const bookings = await getBookingsForToday();
        console.log("Réservations pour aujourd'hui:", bookings);

        for (const booking of bookings) {
            if (booking.user && booking.user.email) {
                // Créer le contenu de l'email
                const subject = "🔔 Rappel de votre réservation";
                const htmlContent = `
          <h1>Bonjour ${booking.user.username},</h1>
          <p>Ceci est un rappel pour votre réservation prévue le <strong>${new Date(booking.date).toLocaleString('fr-FR')}</strong>.</p>
          <p>Merci et à bientôt !</p>
        `;

                // Envoyer l'email
                await sendEmail(booking.user.email, subject, htmlContent);
                console.log(`📩 Email envoyé à ${booking.user.email} pour la réservation du ${booking.date}`);
            }
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi des rappels :", error);
    }
    console.log("Cron job terminé");
});
