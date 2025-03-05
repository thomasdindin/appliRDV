<template>
  <nav class="bg-gray-800">
    <div v-if="authStore.isLoggedIn">
      <RouterLink to="/list-appointment" class="text-white p-4">Appointments</RouterLink>
    </div>
    <div v-else>
      <RouterLink to="/login" class="text-white p-4">Login</RouterLink>
      <RouterLink to="/register" class="text-white p-4">Register</RouterLink>
    </div>
  </nav>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore();
</script>