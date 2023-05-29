<template>
  <div>
    <NavBar />
    <div v-if="usuario && libros">
      <UserInfo :usuario="usuario"/>
      <BookPanel :libros="libros" @libroBorrado="handleLibroBorrado"/>
    </div>
    <div v-else class="has-text-white" style="text-align: center">
      Cargando usuario...
      <progress class="progress is-medium is-dark" max="100">45%</progress>
    </div>
    <div v-if="error">
      Error al cargar el usuario: {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserInfo from '@/components/UserInfo.vue';
import NavBar from '@/components/NavBar.vue';
import BookPanel from '@/components/BookPanel.vue';

export default {
  components: {
    UserInfo,
    NavBar,
    BookPanel
  },
  data() {
    return {
      usuario: null,
      libros: null,
      error: null
    };
  },
  methods: {
    getUsuario() {
      const userId = localStorage.getItem('userId');
      axios.get(`http://localhost:3000/usuarios/${userId}`)
        .then(response => {
          this.usuario = response.data;
          this.getLibros();
        })
        .catch(error => {
          this.error = error.message;
          console.error(error);
        });
    },

    handleLibroBorrado() {
    this.getLibros(); // Vuelve a obtener la lista de libros para refrescarla
  },
  
    getLibros() {
      const userId = localStorage.getItem('userId');
  
      axios.get(`http://localhost:3000/usuarios/${userId}/libros`)
        .then(response => {
          const progresoLibros = response.data;
          const libroIds = progresoLibros.map(libro => libro.libro);
  
          axios.get('http://localhost:3000/libros')
            .then(response => {
              this.libros = response.data.filter(libro => libroIds.includes(libro._id));
              this.libros = this.libros.map(libro => ({
                ...libro,
                showAll: false,
                capituloActual: progresoLibros.find(progreso => progreso.libro === libro._id)?.capituloActual || 0
              }));
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getUsuario();
  }
};
</script>
