import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import AddAppointment from '@/views/AddAppointment.vue'
import ListAppointment from '@/views/ListAppointment.vue'
import {useAuthStore} from "@/stores/authStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isLoggedIn) {
          next({name: 'Home'});
        } else {
          next();
        }
      }
    },
    {
      path: '/register',
      component: Register,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (authStore.isLoggedIn) {
            next({name: 'Home'});
            } else {
            next();
            }
        }

    },
    {
      path: '/add-appointment',
      component: AddAppointment,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isLoggedIn) {
          next({name: 'Login'});
        } else {
          next();
        }
      }
    },
    {
      path: '/list-appointment',
      component: ListAppointment,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (!authStore.isLoggedIn) {
            next({name: 'Login'});
            } else {
            next();
            }
        }
    }

  ],
})

export default router
