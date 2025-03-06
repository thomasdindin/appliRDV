import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import LandingPage from "@/views/LandingPage.vue";
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import Bookings from '@/views/MesReservations.vue'
import Book from '@/views/Reserver.vue'

import {useAuthStore} from "@/stores/authStore.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
          path: '/',
          name: 'LandingPage',
          component: LandingPage,
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
      path: '/accueil',
      name: 'Home',
      component: Home,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (!authStore.isLoggedIn) {
            next({name: 'LandingPage'});
            } else {
            next();
            }
        }
    },
    {
      path: '/login',
        name: 'Login',
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
          path:'/bookings',
          name: 'Reservations',
          component: Bookings,
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
          path:'/book',
          name: 'Reserver',
          component: Book,
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
          path:'/manage',
            name: 'Manage',
            component: () => import('../views/AdminPanel.vue'),
      }

  ],
})

export default router
