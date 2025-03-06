import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 3000,
});

// Interceptor pour attacher le token
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.isLoggedIn) {
            // Si l'utilisateur est loggué, on ajoute le token en header Authorization
            config.headers.Authorization = authStore.token;
        }
        return config;
    },
    (error) => {
        // Gérer les erreurs éventuelles au moment de la config de la requête
        return Promise.reject(error);
    }
);

export default api;
