<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Créer une réservation</h1>

    <!-- Calendrier vue-cal -->
    <vue-cal
        class="vuecal--blue-theme"
        locale="fr"
        default-view="week"
        :disable-views="['years','year','month']"
        :time="true"
        @cell-click="onTimeClick"
        :events="[]"
    />

    <!-- Dialog pour créer la réservation -->
    <Dialog
        v-model:visible="createDialogVisible"
        header="Nouvelle réservation"
        :style="{ width: '25rem' }"
        modal
    >
      <div class="mb-3">
        <label class="block font-semibold mb-1">Date et heure</label>
        <!-- On peut laisser l’utilisateur ajuster, ou mettre en lecture seule -->
        <input
            type="datetime-local"
            v-model="form.dateTime"
            class="border rounded px-3 py-2 w-full"
            required
        />
      </div>

      <div class="mb-3">
        <label class="block font-semibold mb-1">Nombre de personnes</label>
        <input
            type="number"
            v-model.number="form.customers"
            min="1"
            class="border rounded px-3 py-2 w-full"
            required
        />
      </div>

      <template #footer>
        <Button label="Annuler" class="p-button-text" @click="cancelCreate" />
        <Button label="Réserver" class="p-button-primary" @click="submitBooking" />
      </template>
    </Dialog>

    <!-- Messages de succès / erreur -->
    <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Import vue-cal + styles
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import api from "@/services/api.js";

// Contrôle de la dialog
const createDialogVisible = ref(false)

// Formulaire
const form = ref({
  dateTime: '',
  customers: 1
})

// Messages
const successMessage = ref('')
const errorMessage = ref('')

function onTimeClick(event) {
  const clickedDate = event
console.log(clickedDate)
  const localStr = convertToLocalDateTime(clickedDate)
  console.log(localStr)
  form.value.dateTime = localStr
  form.value.customers = 1

  createDialogVisible.value = true
}


function convertToLocalDateTime(isoString) {
  const d = new Date(isoString)   // on parse la string
  const year = d.getFullYear()
  const mon = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hr = String(d.getHours()).padStart(2, '0')
  const min = '00'

  return `${year}-${mon}-${day}T${hr}:${min}`
}



// Annuler la création
function cancelCreate() {
  createDialogVisible.value = false
  form.value.dateTime = ''
  form.value.customers = 1
}

// Soumettre la réservation
async function submitBooking() {
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // On convertit form.dateTime en un champ "date" ISO
    const isoDate = new Date(form.value.dateTime).toISOString()

    const payload = {
      date: isoDate,
      customers: form.value.customers
    }

    // Appel POST /bookings
    const res = await api.post('/bookings', payload)

    successMessage.value = 'Réservation créée avec succès !'
    // Réinitialiser
    createDialogVisible.value = false
    form.value.dateTime = ''
    form.value.customers = 1
  } catch (err) {
    console.error(err)
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'Erreur lors de la création de la réservation'
    }
  }
}
</script>
