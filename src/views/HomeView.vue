<template>
  <div class="home">
    <div class="container" style="padding: 15px;">
      <p class="title is-4 has-text-light">Tus libros</p>
      <hr>
      <CardLibro @bookSelected="showBookPopup" />
      <p class="title is-4 has-text-light">Subir libros</p>
      <hr>
      <UploadLibro />
    </div>
    <BookPopup :book="selectedBook" v-if="selectedBook" @closePopup="selectedBook = null" />
  </div>
</template>

<script>
// @ is an alias to /src
import CardLibro from '@/components/CardLibro.vue'
import UploadLibro from '@/components/UploadLibro.vue'
import BookPopup from '@/components/BookPopup.vue';

export default {
  name: 'HomeView',
  components: {
    CardLibro,
    UploadLibro,
    BookPopup
  },
  data() {
    return {
      selectedBook: null,
    }
  },
  methods: {
    showBookPopup(book) {
      this.selectedBook = book;
    },
  }
}
</script>
