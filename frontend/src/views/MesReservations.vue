<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Mes Réservations (à venir)</h1>

    <!-- Calendrier vue-cal -->
    <vue-cal
        class="vuecal--blue-theme"
        locale="fr"
        default-view="week"
        :disable-views="['years', 'year', 'month']"
        :events="calendarEvents"
        @event-click="onEventClick"
        :time="true"
    />

    <!-- DataTable PrimeVue, paginée, affichant les réservations à venir -->
    <DataTable
        :value="futureBookings"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 15]"
        class="mt-4"
    >
      <Column field="date" header="Date" />
      <Column field="customers" header="Clients" />

      <!-- Colonne Actions avec template -->
      <Column header="Actions">
        <template #body="slotProps">
          <Button
              label="Modifier"
              icon="pi pi-pencil"
              class="p-button-rounded p-button-info mr-2"
              @click="startEdit(slotProps.data)"
          />
          <Button
              label="Supprimer"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="deleteBooking(slotProps.data._id)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Dialog d'édition -->
    <Dialog
        v-model:visible="editDialogVisible"
        modal
        header="Modifier la Réservation"
        :style="{ width: '30rem' }"
    >
      <div v-if="editBooking" class="mb-4">
        <!-- Date -->
        <div class="mb-3">
          <label for="date" class="block font-semibold mb-1">Date</label>
          <InputText
              id="date"
              v-model="editBooking.date"
              class="w-full"
          />
        </div>
        <!-- Nombre de clients -->
        <div class="mb-4">
          <label for="customers" class="block font-semibold mb-1"
          >Nombre de clients</label
          >
          <InputText
              id="customers"
              type="number"
              v-model="editBooking.customers"
              class="w-full"
          />
        </div>
      </div>

      <!-- Boutons en bas de la Dialog -->
      <template #footer>
        <Button label="Annuler" class="p-button-text" @click="cancelEdit" />
        <Button label="Enregistrer" @click="updateBooking" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api.js'
import { useAuthStore } from '@/stores/authStore'

// VueCal
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const authStore = useAuthStore()
const bookings = ref([])           // toutes les réservations de l'utilisateur
const editBooking = ref(null)      // réservation en cours d'édition
const editDialogVisible = ref(false)

// Au montage => fetch bookings
onMounted(() => {
  getMyBookings()
})

// Récupération des réservations
async function getMyBookings() {
  try {
    const res = await api.get('/bookings') // token injecté via l'interceptor
    bookings.value = res.data
  } catch (error) {
    console.error(error)
  }
}

// futureBookings = toutes les résas dont la date >= maintenant
const futureBookings = computed(() => {
  const now = new Date()
  return bookings.value.filter(b => {
    const bDate = new Date(b.date)
    return bDate >= now
  })
})

// Conversion en events vue-cal
const calendarEvents = computed(() => {
  return futureBookings.value.map(b => {
    const start = new Date(b.date)   // ex: 2025-03-10T11:00
    // On suppose 1h de durée (adapter si besoin)
    const end = new Date(start)
    end.setHours(end.getHours() + 1)

    return {
      // titre
      title: `${formatDate(start)} - ${b.customers} pers.`,
      start,
      end,
      bookingId: b._id,
      customers: b.customers,
      // Couleur
      color: '#9feaa5'
    }
  })
})

// Au clic sur un event dans le calendrier => ouvre la popup d'édition
function onEventClick(event) {
  const found = futureBookings.value.find(b => b._id === event.bookingId)
  if (found) {
    startEdit(found)
  }
}

// Format date pour l'affichage (optionnel, déjà géré autrement)
function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// EDIT
function startEdit(booking) {
  editBooking.value = { ...booking }  // copie
  editDialogVisible.value = true
}
function cancelEdit() {
  editDialogVisible.value = false
  editBooking.value = null
}

async function updateBooking() {
  if (!editBooking.value) return
  try {
    const payload = {
      date: editBooking.value.date,
      customers: editBooking.value.customers
    }
    const { data } = await api.put(`/bookings/${editBooking.value._id}`, payload)
    // Mettre à jour localement
    const idx = bookings.value.findIndex(b => b._id === data._id)
    if (idx !== -1) {
      bookings.value[idx] = data
    }
    editDialogVisible.value = false
    editBooking.value = null
  } catch (error) {
    console.error(error)
  }
}

// DELETE
async function deleteBooking(bookingId) {
  if (!confirm('Voulez-vous vraiment supprimer cette réservation ?')) return
  try {
    await api.delete(`/bookings/${bookingId}`)
    bookings.value = bookings.value.filter(b => b._id !== bookingId)
  } catch (error) {
    console.error(error)
  }
}
</script>
