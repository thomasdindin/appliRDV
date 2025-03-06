<template>
  <nav class="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
    <!-- Logo / Nom de la société -->
    <div class="text-xl font-bold">
      <router-link to="/">
        {{ companyName }}
      </router-link>
    </div>

    <!-- Liens de navigation -->
    <div class="flex items-center space-x-4">
      <div v-if="!authStore.isAdmin">
        <!-- Lien vers "Mes réservations" -->
        <router-link
            to="/bookings"
            class="hover:text-gray-300 transition-colors"
        >
          Mes réservations
        </router-link>

        <!-- Lien vers "Réserver" -->
        <router-link
            to="/book"
            class="hover:text-gray-300 transition-colors"
        >
          Réserver
        </router-link>
      </div>

      <router-link to="/manage" v-if="authStore.isAdmin" class="hover:text-gray-300 transition-colors">
        Gérer
      </router-link>


      <!-- Bouton de déconnexion -->
      <button
          v-if="authStore.isLoggedIn"
          @click="handleLogout"
          class="hover:text-gray-300 transition-colors"
      >
        Se déconnecter
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import router from "@/router/index.js";

// Récupérer la variable d'environnement
const companyName = import.meta.env.VITE_COMPANY_NAME

// Récupération du store d'authentification
const authStore = useAuthStore()

// Méthode de déconnexion
function handleLogout() {
  authStore.logout()
  router.push({ name: 'LandingPage' })
}
</script>