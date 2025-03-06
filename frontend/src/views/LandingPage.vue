<template>
  <div class="min-h-screen flex flex-col">
    <!-- Section Hero -->
    <header class="relative h-screen flex items-center justify-center">
      <!-- Image de fond -->
      <img
          class="absolute inset-0 w-full h-full object-cover"
          src="https://source.unsplash.com/1600x900/?restaurant,food"
          alt="Restaurant hero background"
      />
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
          Bienvenue au Restaurant {{restaurantName}}
        </h1>
        <p class="text-lg md:text-2xl text-gray-200 mb-6">
          Une expérience culinaire inoubliable
        </p>
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <!-- Liens vers /register et /login -->
          <router-link
              to="/register"
              class="inline-block bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Inscription
          </router-link>
          <router-link
              to="/login"
              class="inline-block bg-white text-red-500 border border-red-500 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Connexion
          </router-link>
        </div>
      </div>
    </header>

    <!-- Section À propos -->
    <section
        class="flex flex-col md:flex-row items-center justify-between px-6 py-12 space-y-6 md:space-y-0 md:space-x-6"
    >
      <div class="md:w-1/2 space-y-4">
        <h2 class="text-3xl font-bold">À propos de nous</h2>
        <p class="leading-relaxed text-gray-700">
          Notre restaurant vous propose une cuisine raffinée et un service
          chaleureux, dans un cadre élégant. Nous privilégions les produits
          locaux et de saison pour vous offrir une expérience culinaire unique.
        </p>
      </div>
      <div class="md:w-1/2 flex justify-center">
        <img
            class="rounded-lg shadow-lg max-w-full h-auto"
            src="https://source.unsplash.com/600x400/?kitchen,chef"
            alt="Chef cooking"
        />
      </div>
    </section>

    <!-- Section Spécialités -->
    <section class="bg-gray-100 py-12 px-6">
      <h2 class="text-3xl font-bold text-center mb-8">Nos spécialités</h2>
      <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        <!-- Carte 1 -->
        <div
            class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <img
              class="rounded mb-4 w-full h-48 object-cover"
              src="https://source.unsplash.com/300x200/?food,plate"
              alt="Speciality 1"
          />
          <h3 class="text-xl font-semibold mb-2">Plat 1</h3>
          <p class="text-gray-700 text-center">
            Description rapide du plat...
          </p>
        </div>
        <!-- Carte 2 -->
        <div
            class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <img
              class="rounded mb-4 w-full h-48 object-cover"
              src="https://source.unsplash.com/300x200/?food,dish"
              alt="Speciality 2"
          />
          <h3 class="text-xl font-semibold mb-2">Plat 2</h3>
          <p class="text-gray-700 text-center">
            Description rapide du plat...
          </p>
        </div>
        <!-- Carte 3 -->
        <div
            class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <img
              class="rounded mb-4 w-full h-48 object-cover"
              src="https://source.unsplash.com/300x200/?dessert"
              alt="Speciality 3"
          />
          <h3 class="text-xl font-semibold mb-2">Plat 3</h3>
          <p class="text-gray-700 text-center">
            Description rapide du plat...
          </p>
        </div>
      </div>
    </section>

    <!-- Section CTA Réservation -->
    <section
        class="bg-red-500 text-white text-center py-12 px-6 flex flex-col items-center"
    >
      <h2 class="text-3xl font-bold mb-4">Réservez votre table</h2>
      <p class="mb-6 max-w-xl">
        Réservez dès maintenant pour profiter d'un moment gastronomique
        inoubliable.
      </p>
      <router-link
          to="/login"
          class="bg-white text-red-500 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
      >
        Réserver
      </router-link>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300 text-center py-4">
      <p>
        &copy; {{ new Date().getFullYear() }} Restaurant {{restaurantName}}. Tous droits
        réservés.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const restaurantName = import.meta.env.VITE_COMPANY_NAME
</script>

