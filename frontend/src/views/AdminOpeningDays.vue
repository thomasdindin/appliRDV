<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Configuration des horaires</h2>

    <!-- On crée un TabView avec un TabPanel par jour -->
    <TabView>
      <TabPanel
          v-for="(day, idx) in days"
          :key="day._id || idx"
          :header="day.name"
      >
        <!-- Composant enfant qui gère le day (shifts, services) -->
        <DayConfig
            :day="day"
            @day-updated="onDayUpdated"
        />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Enfant
import DayConfig from '@/components/DayConfig.vue'
import api from "@/services/api.js";

// Stockage des jours
const days = ref([])

// Au montage => fetch /openingDays
onMounted(async () => {
  try {
    const res = await api.get('http://localhost:3000/openingDays')
    days.value = res.data
  } catch (err) {
    console.error(err)
    alert("Erreur lors du chargement des jours")
  }
})

// Callback quand un composant DayConfig a mis à jour un jour
function onDayUpdated(updatedDay) {
  // On remplace le day dans days par celui mis à jour
  const index = days.value.findIndex(d => d._id === updatedDay._id)
  if (index !== -1) {
    days.value[index] = updatedDay
  }
}
</script>

<style scoped>
/* Ajustements stylés si besoin */
</style>
