<script setup>
import { ref } from 'vue';
import axios from 'axios';

const description = ref('');

const startDate = ref('');
const endDate = ref('');

const add = async () => {
    const token = localStorage.getItem('token');

if (new Date(startDate) > new Date(endDate)) {
    try {
        const response = await axios.post('http://localhost:3000/appointment/create', {
            description: description.value,
            startDate: startDate.value,
            endDate: endDate.value,
        }, {
            headers: {
                Authorization: token
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    
   {
	alert("Start date should be less than end date");
	return false;
} 
}

        
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
	<div class="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
		<h1 class="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome Back!</h1>
		<form @submit.prevent = add() class="space-y-4">
			<div class="mb-4">
				<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">description</label>
				<input v-model="description" type="text" id="description" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
			</div>
			<div class="mb-4">
				<label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">startDate</label>
				<input v-model="startDate" type="datetime-local" id="startDate" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
			</div>
            <div class="mb-4">
				<label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">endDate</label>
				<input v-model="endDate" type="datetime-local" id="endDate" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
			</div>
			<div class="flex items-center justify-between mb-4">
			</div>
			<button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
		</form>
	</div>
</div>
</template>