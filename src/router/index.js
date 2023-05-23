import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from "../components/NotFound.vue";
import RegistroView from '../views/RegisterView.vue';
import LoginUsuario from '../views/LoginView.vue';
import ReaderView from '../views/ReaderView.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } // Agregar meta información para protección de ruta
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
      path: '/reader',
      name: 'ReaderView',
      component: ReaderView
    },
    {
      path: "/:pathmatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // El usuario no está autenticado y la ruta requiere autenticación, redirigir a la página de login
    next('/login');
  } else {
    next();
  }
});

export default router
