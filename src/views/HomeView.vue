<template>
  <NavBar />
  <div v-if="isLoaded" class="home">
    <div class="container" style="padding: 15px;">
      <p class="title is-4 has-text-light">Tus libros</p>
      <hr>
      <CardLibro @bookSelected="showBookPopup" />
      <p class="title is-4 has-text-light">Subir libros</p>
      <hr>
      <UploadLibro />
    </div>
    <BookPopup :pagina="capituloActual" :book="selectedBook" v-if="selectedBook" @closePopup="selectedBook = null" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import CardLibro from '@/components/CardLibro.vue';
import UploadLibro from '@/components/UploadLibro.vue';
import BookPopup from '@/components/BookPopup.vue';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'HomeView',
  components: {
    CardLibro,
    UploadLibro,
    BookPopup,
    NavBar
  },
  data() {
    return {
      isLoaded: false,
      selectedBook: null,
      capituloActual: null,
      showEpubReader: false,
    }
  },
  computed: {
    ...mapState(['currentLocation'])
  },
  mounted() {
    const currentLocation = localStorage.getItem('currentLocation');
    const currentBookId = localStorage.getItem('currentBookId');
    const currentBookProgress = localStorage.getItem('currentProgress');

    if (currentLocation != null || currentBookId != null) {
      this.saveCurrentLocation(currentLocation, currentBookId, currentBookProgress);
    }else{
      this.isLoaded = true;
    }
  },
  methods: {
    showBookPopup(book, pagina) {
      this.selectedBook = book;
      this.capituloActual = parseInt(pagina);
    },
    saveCurrentLocation(currentLocation, currentBookId, currentBookProgress) {

      const userId = localStorage.getItem('userId');
      const libroId = currentBookId;

      const url = `http://localhost:3000/usuarios/${userId}/libros/${libroId}`;
      const data = {
        capituloActual: currentBookProgress,
        epubCfi: currentLocation
      };

      axios
        .put(url, data)
        .then((response) => {
          // La solicitud se realizó con éxito
          localStorage.removeItem('currentProgress');
          localStorage.removeItem('currentBookId');
          localStorage.removeItem('currentLocation')
          console.log(response.data);
          this.isLoaded = true;
        })
        .catch((error) => {
          // Ocurrió un error al hacer la solicitud
          console.error(error);
          this.isLoaded = true;
        });
    }
  }
}
</script>
