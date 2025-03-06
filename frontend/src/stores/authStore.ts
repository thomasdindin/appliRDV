import { ref, computed } from 'vue'
import {acceptHMRUpdate, defineStore} from 'pinia'

export function parseJwt(token: string) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

export const useAuthStore = defineStore(
    'authStore',
    () => {
        const username = ref<string | null>(null)
        const email = ref<string | null>(null)
        const token = ref<string | null>(null)
        const role = ref<string | null>(null)

        const setToken = (newToken: string | null) => {
            token.value = newToken;

            const decodedToken = parseJwt(newToken);
            username.value = decodedToken.username;
            email.value = decodedToken.email;
            role.value = decodedToken.role;
        };

        const isLoggedIn = computed(() => token.value !== null && token.value !== undefined);
        const isAdmin = computed(() => role.value === 'admin');

        const logout = () => {
            token.value = null;
            username.value = null;
            email.value = null;
            role.value = null;
        }

        return {
            token,
            username,
            email,
            role,
            setToken,
            logout,
            isLoggedIn,
            isAdmin
        };
    }, {
        persist: true,
    }
)