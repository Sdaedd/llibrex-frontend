<template>
    <div class="columns is-mobile is-multiline is-fullheight">
      <div class="column is-one-fifth-desktop is-one-third-tablet is-half-mobile" v-for="libro in libros" :key="libro.id">
        <div class="card has-background-black-ter has-text-white">
            <div class="card-image" @click="showBookPopup(libro)">
              <figure class="image is-4by3">
                <img :src="libro.image" :alt="'Imagen de ' + libro.titulo">
                <div class="image-overlay"></div>
              </figure>
              <progress class="progress is-small is-dark" :value="libro.capituloActual" :max="100">
                {{ libro.capituloActual }}%
              </progress>
            </div>
            <div class="card-content">
              <div class="content title is-6 has-text-light" @click="showBookPopup(libro)">
                <p>
                  {{ truncateTitle(libro.title, 42) }}
                  <span v-if="libro.title.length > 42">...</span>
                </p>
              </div>
            </div>
            <div class="card-content">
              <p class="subtitle is-7 has-text-grey">{{ formatAuthors(libro.authors) }}</p>
            </div>
            <footer class="card-footer has-background-black-ter">
              <button class="button is-primary is-outlined is-small card-footer-item" @click="leerLibro(libro)">
                <span class="is-size-6">Leer</span>
                <span class="icon is-small">
                  <i class="fas fa-book-open"></i>
                </span>
              </button>
            </footer>
          </div>
      </div>
    </div>
    <div id="reader"></div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';
  
  export default {
    emits: ['bookSelected', 'readBook'],
    name: 'ColumnCard',
    props: {
    libros: {
      type: Array,
      required: true,
    }
  },
    data() {
      return {
        selectedBook: null, // propiedad para almacenar el libro seleccionado
        showEpubReader: false,
      }
    },
    methods: {
      ...mapMutations(['setSelectedBook']), // Importa la mutación setSelectedBook
  
      showBookPopup(libro) {
        this.$emit('bookSelected', libro, libro.capituloActual);
      },
  
      truncateTitle(title, maxLength) {
        if (title.length > maxLength) {
          return title.substring(0, maxLength);
        }
        return title;
      },
  
      formatAuthors(authors) {
        return authors[0].replace(',', ' & ');
      },
      leerLibro(libro) {
        this.setSelectedBook(libro); // Almacena el libro seleccionado en Vuex
        localStorage.setItem('currentBookId', libro._id);
        this.$router.push({ name: 'ReaderView' }); // Redirige a la vista ReaderView
      },
  
    }
  }
  </script>
  
  <style scoped>
  .card {
    position: relative;
    width: 230px;
    max-height: 100%;
    flex-grow: 1;
  }
  
  .column {
    max-height: 375px;
  }
  
  .content {
    height: 100%;
    max-height: 10px;
  }
  
  .progress {
    width: 90%;
    margin: auto;
    border: white solid 1px;
  }

  .title {
    cursor: pointer;
  }
  
  .image {
    position: relative;
  }
  
  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(to top, hsl(0, 0%, 14%, 100) 1%, rgba(0, 0, 0, 0));
  }
  
  .image:hover::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 3px solid white;
    border-radius: 5px;
    z-index: 1;
    filter: blur(5px);
    cursor: pointer;
    /* Cambia el cursor al estilo de un link */
  }
  
  .modal-card-foot {
    height: 40px;
  }
  </style>