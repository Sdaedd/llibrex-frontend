import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from "../components/NotFound.vue";
import RegistroView from '../views/RegisterView.vue';
import LoginUsuario from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegistroView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUsuario
    },
    {
      path: "/:pathmatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ]
})

export default router
