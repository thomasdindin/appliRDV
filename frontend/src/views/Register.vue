
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
    <div class="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
	<div class="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome Back!</h1>
		<form @submit.prevent = register() class="space-y-4">
			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
				<input v-model="email" type="email" id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required>
			</div>
            <div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">username</label>
				<input v-model="username" type="text" id="username" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required>
			</div>
			<div class="mb-4">
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
				<input v-model="password" type="password" id="password" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" required>
			</div>
			<button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
		</form>
	</div>
</div>
</template>