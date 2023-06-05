<template>
  <NavBar />
  <div class="tabs is-centered has-background-warning">
    <ul>
      <li><a href="/cuenta">Panel de Usuario</a></li>
      <li class="is-active has-text-black has-background-dark"><a>Panel de administrador</a></li>
    </ul>
  </div>
  <div>
    <AdminPanel :usuarios="usuarios" />
  </div>
</template>

<script>
import axios from 'axios';
import AdminPanel from '@/components/AdminPanel.vue';
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar,
    AdminPanel,
  },
  data() {
    return {
      usuarios: [],
    };
  },
  mounted() {
    this.obtenerUsuarios();
  },
  methods: {
    obtenerUsuarios() {
      axios
        .get('http://localhost:3000/usuarios')
        .then((response) => {
          this.usuarios = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    const userId = localStorage.getItem('userId');

    axios
      .get('http://localhost:3000/usuarios')
      .then((response) => {
        const usuarios = response.data;
        const usuarioActual = usuarios.find(usuario => usuario._id === userId);
        const userIsAdmin = usuarioActual && usuarioActual.acceso === 'admin';

        if (!userIsAdmin) {
          next('/cuenta');
        } else {
          next();
        }
      })
      .catch((error) => {
        console.error(error);
        next(false);
      });
  },
};
</script>