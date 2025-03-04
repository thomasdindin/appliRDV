import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import AddAppointment from '@/views/AddAppointment.vue'
import ListAppointment from '@/views/ListAppointment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/add-appointment',
      component: AddAppointment,
    },
    {
      path: '/list-appointment',
      component: ListAppointment,
    }

  ],
})

export default router
