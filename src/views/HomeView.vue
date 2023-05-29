<template>
  <NavBar />
  <div v-if="isLoaded && libros.length > 0" class="home">
    <div class="container" style="padding: 15px;">
      <p class="title is-3 has-text-light">Tus libros</p>
      <hr>
      <BookSearch @filter="filterBooks" />
      <ColumnCards :libros="filteredLibros" @bookSelected="showBookPopup" />
    </div>
    <BookPopup :pagina="capituloActual" :book="selectedBook" v-if="selectedBook" @closePopup="selectedBook = null" @libroBorrado="handleLibroBorrado" />  
  </div>
  
  <div v-if="filteredLibros.length == 0 || libros.length < 0" class="container" style="text-align: center">
    <br />
    <div class="notification is-warning is-light">
      No hay libros que mostrar
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import ColumnCards from '@/components/ColumnCards.vue';
import BookPopup from '@/components/BookPopup.vue';
import NavBar from '@/components/NavBar.vue';
import BookSearch from '@/components/BookSearch.vue';

export default {
  name: 'HomeView',
  components: {
    ColumnCards,
    BookPopup,
    NavBar,
    BookSearch,
  },
  data() {
    return {
      isLoaded: false,
      selectedBook: null,
      capituloActual: null,
      libros: [], // todos los libros
      filteredLibros: [], // libros filtrados
    };
  },
  computed: {
    ...mapState(['currentLocation']),
  },
  mounted() {
    const currentLocation = localStorage.getItem('currentLocation');
    const currentBookId = localStorage.getItem('currentBookId');
    const currentBookProgress = localStorage.getItem('currentProgress');

    if (currentLocation != null || currentBookId != null) {
      this.saveCurrentLocation(currentLocation, currentBookId, currentBookProgress);
    } else {
      this.isLoaded = true;
    }
    this.getLibros();
  },
  methods: {
    showBookPopup(book, pagina) {
      this.selectedBook = book;
      this.capituloActual = parseInt(pagina);
    },
    handleLibroBorrado() {
    this.getLibros(); // Vuelve a obtener la lista de libros para refrescarla
  },
    getLibros() {
      const userId = localStorage.getItem('userId');

      axios
        .get(`http://localhost:3000/usuarios/${userId}/libros`)
        .then((response) => {
          const progresoLibros = response.data;
          const libroIds = progresoLibros.map((libro) => libro.libro);

          axios
            .get('http://localhost:3000/libros')
            .then((response) => {
              this.libros = response.data
                .filter((libro) => libroIds.includes(libro._id))
                .map((libro) => ({
                  ...libro,
                  showAll: false,
                  capituloActual: progresoLibros.find((progreso) => progreso.libro === libro._id)?.capituloActual || 0,
                }));
              this.filteredLibros = this.libros
              this.isLoaded = true;
            })
            .catch((error) => {
              console.log(error);
              this.isLoaded = true;
            });
        })
        .catch((error) => {
          console.log(error);
          this.isLoaded = true;
        });
    },
    saveCurrentLocation(currentLocation, currentBookId, currentBookProgress) {
      const userId = localStorage.getItem('userId');
      const libroId = currentBookId;

      const url = `http://localhost:3000/usuarios/${userId}/libros/${libroId}`;
      const data = {
        capituloActual: currentBookProgress,
        epubCfi: currentLocation,
      };

      axios
        .put(url, data)
        .then(() => {
          localStorage.removeItem('currentProgress');
          localStorage.removeItem('currentBookId');
          localStorage.removeItem('currentLocation');
        })
        .catch(error => {
          console.error(error);
          this.isLoaded = true;
        });
    },
    filterBooks(searchQuery) {
      if (searchQuery) {
        this.filteredLibros = this.libros.filter(libro =>
          libro.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.filteredLibros = this.libros;
      }
    },
    beforeRouteUpdate(to, from, next) {
      this.getLibros();
      next();
    },
  },
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css')
</style>