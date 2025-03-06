
<script setup>
import { ref } from 'vue';
import api from "@/services/api.js";

const email = ref('');
const password = ref('');
const username = ref('');

const register = async () => {
    try {
        const response = await api.post('user/register', {
            email: email.value,
            password: password.value,
            username: username.value
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}


</script>

<template>
    <div class="min-h-screen flex items-center justify-center w-full ">
	<div class="bg-white dark:bg-gray-700 shadow-md rounded-lg px-8 py-6 max-w-md">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Bienvenue !</h1>
		<form @submit.prevent = register() class="space-y-4">
			<div class="mb-4">
				<input v-model="email" type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500" placeholder="Email" required>
			</div>
            <div class="mb-4">
				<input v-model="username" type="text" id="username" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500" placeholder="Nom d'utilisateur" required>
			</div>
			<div class="mb-4">
				<input v-model="password" type="password" id="password" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500" placeholder="Mot de passe" required>
			</div>

      <div class="flex items-center justify-between mb-4">
        <p> Vous avez déjà un compte ? </p>
        <a href="/login" class="text-xs text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-base">Connectez-vous</a>
      </div>
			<button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Inscription</button>
		</form>
	</div>
</div>
</template>