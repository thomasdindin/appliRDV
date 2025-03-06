<script setup>
import { ref } from 'vue';
import {useAuthStore} from "@/stores/authStore.js";
import api from "@/services/api.js";
import router from "@/router/index.js";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const email = ref('');
const password = ref('');

const authStore = useAuthStore();

const login = async () => {
    try {
        const response = await api.post('user/login', {
            email: email.value,
            password: password.value
        });
        authStore.setToken(response.data.token);

        toast.add({severity: 'success', summary: 'Success', detail: 'Vous êtes connecté', life: 3000});
        await router.push({name: 'Home'});
    } catch (error) {
      toast.add({severity: 'error', summary: 'Error', detail: 'Email ou mot de passe incorrect', life: 3000});
      console.error(error)
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center w-full ">
	<div class="bg-white dark:bg-gray-700 shadow-md rounded-lg px-8 py-6 max-w-md">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Connectez-vous</h1>
		<form @submit.prevent = login() class="space-y-4">
			<div class="mb-4">
				<input v-model="email" type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email..." required>
			</div>
			<div class="mb-4">
				<input v-model="password" type="password" id="password" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Mot de passe..." required>
			</div>
			<div class="flex items-center justify-between mb-4">
        <p> Vous n'avez pas de compte ? </p>
				<a href="/register"
					class="text-xs text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-base">Créez-en un</a>
			</div>
			<button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Login</button>
		</form>
	</div>
</div>
</template>