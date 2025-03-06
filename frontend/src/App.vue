<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import {useAuthStore} from "@/stores/authStore.js";
</script>

<template>
  <Navbar v-if="useAuthStore().isLoggedIn"/>
  <Toast />
  <RouterView />
</template>