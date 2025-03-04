<template>
    <div class="container mt-5">
      <h2>Calendrier des rendez-vous</h2>
      <vue-cal class="vuecal--blue-theme"
        locale="fr"
        :events="appointments"
        :disable-views="['years', 'year']"
        @event-click="showEventDetails"
        :time="true"
      />
      
      <!-- Modal pour afficher les détails -->
      <div v-if="selectedEvent" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Détails du rendez-vous</h5>
              <button type="button" class="btn-close" @click="selectedEvent = null"></button>
            </div>
            <div class="modal-body">
              <p><strong>Titre:</strong> {{ selectedEvent.title }}</p>
              <p><strong>Date:</strong> {{ formatDate(selectedEvent.start) }}</p>
              <p><strong>description:</strong> {{ selectedEvent.duration }} minutes</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="selectedEvent = null">Fermer</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="selectedEvent" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import VueCal from "vue-cal";
  import "vue-cal/dist/vuecal.css";
  import axios from "axios";
  
  const appointments = ref([]);
  const selectedEvent = ref(null);
  const token = localStorage.getItem('token');
  
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/appointment/user", {
            headers: {
                Authorization: token
            }});
      appointments.value = response.data.map((appt) => ({
        description: appt.description,
        start: new Date(appt.startDate),
        end: new Date(appt.endDate)
      } 
    ));
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous", error);
    }
  };
  
  const showEventDetails = (event) => {
    selectedEvent.value = event;
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  
  onMounted(fetchAppointments);
  </script>
  