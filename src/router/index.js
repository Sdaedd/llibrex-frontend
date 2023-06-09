import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from "../components/NotFound.vue";
import RegistroView from '../views/RegisterView.vue';
import LoginUsuario from '../views/LoginView.vue';
import ReaderView from '../views/ReaderView.vue';
import BibliotecaView from '../views/BibliotecaView.vue';
import AccountView from '../views/AccountView.vue';
import AdminView from '../views/AdminView.vue'


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
      component: ReaderView,
      meta: { requiresAuth: true }
      
    },
    {
      path: '/biblioteca',
      name: 'BibliotecaView',
      component: BibliotecaView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/cuenta',
      name: 'AccountView',
      component: AccountView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/admin',
      name: 'AdminView',
      component: AdminView,
      meta: { requiresAuth: true } 
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