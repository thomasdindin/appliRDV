<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Administration - Tableau de bord</h1>

    <!-- TabView :
         - Onglet 1 : Calendrier des réservations
         - Onglet 2 : Configuration des horaires
    -->
    <TabView>
      <TabPanel header="Calendrier des Réservations">
        <div class="mt-4">
          <!-- VueCal pour afficher toutes les réservations -->
          <vue-cal
              class="vuecal--blue-theme"
              locale="fr"
              default-view="week"
              :disable-views="['years', 'year', 'month']"
              :events="bookingEvents"
              @event-click="onEventClick"
              :time="true"
          />
        </div>

        <!-- Modale (ou Dialog) pour afficher le détail d'une réservation -->
        <Dialog
            v-model:visible="showBookingDetail"
            header="Détails de la Réservation"
            :style="{ width: '25rem' }"
            modal
        >
          <div v-if="selectedBooking" class="mb-3">
            <p><strong>Réservation #:</strong> {{ selectedBooking.bookingId }}</p>
            <p><strong>Date/Horaire:</strong> {{ formatDate(selectedBooking.start) }}</p>
            <p><strong>Nb de clients:</strong> {{ selectedBooking.customers }}</p>
            <p><strong>User:</strong> {{ selectedBooking.username }}</p>
          </div>
          <template #footer>
            <Button label="Fermer" @click="showBookingDetail = false" />
          </template>
        </Dialog>
      </TabPanel>

      <TabPanel header="Configuration des horaires">
        <!-- On réutilise votre logique de jours, shifts, services -->
        <AdminOpeningDays />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Components PrimeVue
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

// vue-cal
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

// Composant de gestion d'ouverture
import AdminOpeningDays from './AdminOpeningDays.vue' // ton composant gérant shifts & services

import axios from 'axios'
import api from "@/services/api.js";

// bookingEvents => events pour vue-cal
const bookingEvents = ref([])

// Contrôle de la Dialog pour détails
const showBookingDetail = ref(false)
const selectedBooking = ref(null)

// Récupération du token (admin) depuis localStorage ou un store
const token = localStorage.getItem('token') || ''

// Au montage, on charge toutes les réservations (GET /bookings)
onMounted(fetchAllBookings)

async function fetchAllBookings() {
  try {
    const res = await api.get('http://localhost:3000/bookings')
    // Transformons chaque booking en un event vue-cal
    // booking : { _id, date, customers, user { username, ... } ... }
    bookingEvents.value = res.data.map((bk) => {
      // Start = bk.date
      const start = new Date(bk.date)
      // On considère la fin 1h après (ex.)
      const end = new Date(bk.date)
      end.setHours(end.getHours() + 1)

      return {
        title: `#${bk._id} - ${bk.customers} pers.`,
        start,
        end,
        // infos additionnelles
        bookingId: bk._id,
        customers: bk.customers,
        username: bk.user?.username || 'Inconnu',
        color: '#f08080', // rouge clair
      }
    })
  } catch (err) {
    console.error(err)
    alert('Erreur lors du chargement des réservations.')
  }
}

// Au clic sur un event => on ouvre la modale
function onEventClick(event) {
  selectedBooking.value = event
  showBookingDetail.value = true
}

function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
/* Ajustements éventuels */
</style>
