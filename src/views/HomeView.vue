<template>
  <NavBar />
  <div class="home">
    <div class="container" style="padding: 15px;">
      <p class="title is-4 has-text-light">Tus libros</p>
      <hr>
      <CardLibro @bookSelected="showBookPopup"/>
      <p class="title is-4 has-text-light">Subir libros</p>
      <hr>
      <UploadLibro />
    </div>
    <BookPopup :pagina="capituloActual" :book="selectedBook" v-if="selectedBook" @closePopup="selectedBook = null" />
  </div>
</template>

<script>
// @ is an alias to /src
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
      selectedBook: null,
      capituloActual: null,
      showEpubReader: false,
    }
  },
  methods: {
    showBookPopup(book, pagina) {
      this.selectedBook = book;
      this.capituloActual = parseInt(pagina);
    },
  }
}
</script>
