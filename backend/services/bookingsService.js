// services/bookingService.js
const Bookings = require('../model/Reservation');
const OpeningDay = require('../model/Schedule');
const mailer = require('../mail');

/**
 * Crée une nouvelle réservation après vérification de la capacité.
 * @param {Object} user - l'utilisateur (doit contenir _id, role, etc.)
 * @param {Date} date - la date/heure souhaitée
 * @param {Number} customers - nb de personnes
 * @returns {Promise<Bookings>} - la réservation créée
 */
async function createBooking(user, date, customers) {
    // 1) Déterminer dayOfWeek à partir de la date
    const dayOfWeek = new Date(date).getDay(); // 0=dimanche, 1=lundi, ...

    // 2) Récupérer le OpeningDay correspondant
    const dayConfig = await OpeningDay.findOne({ dayOfWeek });
    if (!dayConfig) {
        throw new Error("Ce jour n'est pas configuré dans le planning");
    }

    // 3) Déterminer l'heure
    const hour = new Date(date).getHours();

    // 4) Trouver le service (ou shift) correspondant à `hour` dans dayConfig.services
    //    On suppose que "services" est un tableau de timeslot {startHour, endHour, capacity}
    //    On cherche par ex. un timeslot dont startHour <= hour < endHour
    const timeslot = dayConfig.services.find(ts => (hour >= ts.startHour && hour < ts.endHour));
    if (!timeslot) {
        throw new Error("Aucun service ne correspond à cette heure, ou le resto est fermé.");
    }

    // 5) Vérifier la capacité
    //    Il faut compter le total de customers pour ce timeslot
    //    => on cherche toutes les bookings sur la même date, même créneau
    //    Simplification : on compare seulement l'heure
    //    Si vous voulez plus de précision sur la durée, adapter la logique.
    const start = new Date(date);
    start.setMinutes(0,0,0);
    const end = new Date(start);
    end.setHours(end.getHours() + (timeslot.endHour - timeslot.startHour));

    // Récupérer toutes les réservations dont la date est comprise dans [start, end)
    // OU, plus simplement, on compare juste l'heure. À adapter selon votre usage.
    // Ex:
    const sameSlotBookings = await Bookings.find({
        date: {
            $gte: start,
            $lt: end
        }
    });

    // Calculer la somme des customers
    const sumCustomers = sameSlotBookings.reduce((acc, b) => acc + b.customers, 0);

    if (sumCustomers + customers > timeslot.capacity) {
        throw new Error("Capacité dépassée pour ce créneau");
    }

    // 6) Créer la réservation
    const newBooking = new Bookings({
        user: user.id,
        date,
        customers
    });

    const saved = await newBooking.save();

    mailer(user.email, 'Réservation confirmée', `Votre réservation pour le ${date} a été confirmée.`);


    return saved;
}

/**
 * Récupère toutes les réservations selon le rôle.
 */
async function getAllBookings(user) {
    if (user.role === 'admin') {
        return Bookings.find().populate('user', 'username email');
    }
    else {
        // user normal => bookings de l'utilisateur
        return Bookings.find({ user: user.id }).populate('user', 'username email');
    }
}

/**
 * Met à jour une réservation existante
 */
async function updateBooking(user, bookingId, updates) {
    // Récupérer la réservation
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
        throw new Error("Réservation non trouvée");
    }

    // Vérifier droits
    if (user.role !== 'admin' && booking.user.toString() !== user.id.toString()) {
        throw new Error("Accès refusé");
    }

    // Mettre à jour
    if (updates.date) booking.date = updates.date;
    if (updates.customers) booking.customers = updates.customers;

    // (Optionnel) Si on veut re-vérifier la capacité => répéter la logique ?
    // => adaptater selon besoin. On se contente d'une maj basique
    const updated = await booking.save();
    return updated;
}

/**
 * Supprime une réservation
 */
async function deleteBooking(user, bookingId) {
    const booking = await Bookings.findById(bookingId);
    if (!booking) {
        throw new Error("Réservation non trouvée");
    }
    // Vérifier droits
    if (user.role !== 'admin' && booking.user.toString() !== user.id.toString()) {
        throw new Error("Accès refusé");
    }

    await booking.deleteOne();
    return true;
}

async function getBookingsForToday() {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    return Bookings.find({
        date: {
            $gte: start,
            $lt: end
        }
    }).populate('user', 'username email');
}

module.exports = {
    createBooking,
    getAllBookings,
    updateBooking,
    deleteBooking
};
