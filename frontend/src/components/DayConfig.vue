<template>
  <div class="mt-2">
    <h3 class="text-xl font-semibold mb-4">
      Configuration: {{ day.name }}
    </h3>

    <!-- TABLEAU DES SHIFTS -->
    <h4 class="text-lg font-bold mb-2">Shifts</h4>
    <DataTable :value="day.shifts" responsiveLayout="scroll">
      <template #header>
        <Toolbar class="mb-2">
          <template #start>
            <Button label="Ajouter Shift" icon="pi pi-plus" @click="showShiftDialog(null)" />
          </template>
        </Toolbar>
      </template>
      <Column field="startHour" header="Début (h)" />
      <Column field="endHour" header="Fin (h)" />
      <Column field="capacity" header="Capacité" />
      <Column>
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="mr-2" @click="showShiftDialog(data)" />
          <Button icon="pi pi-trash" class="p-button-danger" @click="deleteShift(data)" />
        </template>
      </Column>
    </DataTable>

    <Button
        label="Générer Services (1h)"
        icon="pi pi-cog"
        class="mt-3"
        @click="generateServices"
        :disabled="!day.shifts.length"
    />

    <!-- TABLEAU DES SERVICES -->
    <h4 class="text-lg font-bold mt-4">Services</h4>
    <DataTable :value="day.services" responsiveLayout="scroll">
      <template #header>
        <Toolbar class="mb-2">
          <template #start>
            <Button label="Ajouter Service" icon="pi pi-plus" @click="showServiceDialog(null)" />
          </template>
          <template #end>
            <Button label="Capacité globale" icon="pi pi-clone" class="p-button-sm" @click="applyGlobalCapacity" :disabled="!day.services.length" />
          </template>
        </Toolbar>
      </template>
      <Column field="startHour" header="Début (h)" />
      <Column field="endHour" header="Fin (h)" />
      <Column field="capacity" header="Capacité" />
      <Column>
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="mr-2" @click="showServiceDialog(data)" />
          <Button icon="pi pi-trash" class="p-button-danger" @click="deleteService(data)" />
        </template>
      </Column>
    </DataTable>

    <!-- SHIFT DIALOG -->
    <Dialog v-model:visible="shiftDialogVisible" header="Shift" :style="{ width: '25rem' }" modal>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Heure début</label>
        <InputNumber v-model="editShift.startHour" :min="0" :max="23" class="w-full" />
      </div>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Heure fin</label>
        <InputNumber v-model="editShift.endHour" :min="0" :max="23" class="w-full" />
      </div>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Capacité</label>
        <InputNumber v-model="editShift.capacity" :min="1" :max="999" class="w-full" />
      </div>
      <template #footer>
        <Button label="Annuler" class="p-button-text" @click="shiftDialogVisible = false" />
        <Button label="Enregistrer" icon="pi pi-check" @click="saveShift" />
      </template>
    </Dialog>

    <!-- SERVICE DIALOG -->
    <Dialog v-model:visible="serviceDialogVisible" header="Service" :style="{ width: '25rem' }" modal>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Heure début</label>
        <InputNumber v-model="editService.startHour" :min="0" :max="23" class="w-full" />
      </div>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Heure fin</label>
        <InputNumber v-model="editService.endHour" :min="0" :max="23" class="w-full" />
      </div>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Capacité</label>
        <InputNumber v-model="editService.capacity" :min="1" :max="999" class="w-full" />
      </div>
      <template #footer>
        <Button label="Annuler" class="p-button-text" @click="serviceDialogVisible = false" />
        <Button label="Enregistrer" icon="pi pi-check" @click="saveService" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from "@/services/api.js";

const props = defineProps({
  day: {
    type: Object,
    required: true
  }
})

// Evénement quand on a mis à jour le "day"
const emit = defineEmits(['day-updated'])

// SHIFT DIALOG
const shiftDialogVisible = ref(false)
const editShift = ref({ startHour: 10, endHour: 14, capacity: 50 })
let currentShiftIndex = -1

// SERVICE DIALOG
const serviceDialogVisible = ref(false)
const editService = ref({ startHour: 0, endHour: 0, capacity: 50 })
let currentServiceIndex = -1

// Récupération du token admin
const token = localStorage.getItem('token') || ''

function showShiftDialog(shift) {
  if (shift) {
    // Edition
    currentShiftIndex = props.day.shifts.indexOf(shift)
    editShift.value = { ...shift }
  } else {
    // Nouveau
    currentShiftIndex = -1
    editShift.value = { startHour: 10, endHour: 14, capacity: 50 }
  }
  shiftDialogVisible.value = true
}

async function saveShift() {
  // Vérifier la validité
  if (editShift.value.endHour <= editShift.value.startHour) {
    alert("Heure de fin doit être > heure de début.")
    return
  }
  if (currentShiftIndex === -1) {
    // Ajout
    props.day.shifts.push({ ...editShift.value })
  } else {
    // Edition
    props.day.shifts[currentShiftIndex] = { ...editShift.value }
  }
  shiftDialogVisible.value = false
  await updateDayOnServer()
}

function deleteShift(shift) {
  if (!confirm("Supprimer ce shift ?")) return
  const idx = props.day.shifts.indexOf(shift)
  if (idx !== -1) {
    props.day.shifts.splice(idx, 1)
    updateDayOnServer()
  }
}

// Générer services => 1h par shift
async function generateServices() {
  const day = props.day
  day.services = []
  for (const shift of day.shifts) {
    const start = shift.startHour
    const end = shift.endHour
    // ex: 10 => 11, 11 => 12, ...
    for (let h = start; h < end; h++) {
      day.services.push({
        startHour: h,
        endHour: h + 1,
        capacity: shift.capacity
      })
    }
  }
  await updateDayOnServer()
}

// Appliquer une capacité globale
async function applyGlobalCapacity() {
  const day = props.day
  const cap = prompt("Capacité à appliquer à tous les services ?", "50")
  if (!cap) return
  const numCap = parseInt(cap, 10)
  if (isNaN(numCap)) return
  day.services.forEach(s => {
    s.capacity = numCap
  })
  await updateDayOnServer()
}

// SERVICES
function showServiceDialog(service) {
  if (service) {
    currentServiceIndex = props.day.services.indexOf(service)
    editService.value = { ...service }
  } else {
    currentServiceIndex = -1
    editService.value = { startHour: 0, endHour: 0, capacity: 50 }
  }
  serviceDialogVisible.value = true
}
async function saveService() {
  if (editService.value.endHour <= editService.value.startHour) {
    alert("Heure de fin doit être > heure de début.")
    return
  }
  if (currentServiceIndex === -1) {
    props.day.services.push({ ...editService.value })
  } else {
    props.day.services[currentServiceIndex] = { ...editService.value }
  }
  serviceDialogVisible.value = false
  await updateDayOnServer()
}

function deleteService(service) {
  if (!confirm("Supprimer ce service ?")) return
  const idx = props.day.services.indexOf(service)
  if (idx !== -1) {
    props.day.services.splice(idx, 1)
    updateDayOnServer()
  }
}

// PUT /openingDays/:id
async function updateDayOnServer() {
  if (!props.day._id) {
    // Jour non encore en base => éventuellement POST
    return
  }
  try {
    const payload = {
      dayOfWeek: props.day.dayOfWeek,
      name: props.day.name,
      shifts: props.day.shifts,
      services: props.day.services
    }
    const res = await api.put(
        `/openingDays/${props.day._id}`, payload)
    // On met à jour localement day
    // res.data = doc mis à jour
    // et on émet un event
    emit('day-updated', res.data)
  } catch (err) {
    console.error(err)
    alert("Erreur lors de la mise à jour du jour.")
  }
}
</script>