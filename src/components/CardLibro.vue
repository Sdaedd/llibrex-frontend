<template>
  <div class="columns is-mobile is-multiline">
    <div class="column is-one-fifth" v-for="libro in libros" :key="libro.id">
      <div class="card has-background-black-ter has-text-white">
        <div class="card-image">
          <figure class="image is-4by3" @click="showBookPopup(libro)">
            <img :src="libro.image" :alt="'Imagen de ' + libro.titulo" class="image">
            <div class="image-overlay"></div>
          </figure>
          <progress class="progress is-small is-dark" :value="libro.capituloActual" :max="libro.pageCount">{{ libro.capituloActual }}%</progress>        
        </div>
        <div class="card-content container">
          <div class="content title is-6 has-text-light">
            <p v-if="!libro.showAll">
              {{ truncateTitle(libro.title, 42) }}
              <a v-if="libro.title.length > 38" @click="libro.showAll = true">...</a>
            </p>
            <p v-if="libro.showAll">
              {{ truncateTitle(libro.title, 56) }}
              <a @click="libro.showAll = false">←</a>
            </p>
          </div>
        </div>
        <div class="card-content">
          <p class="subtitle is-7 has-text-grey">{{ formatAuthors(libro.authors) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CardLibro',
  data() {
    return {
      libros: [],
      selectedBook: null // propiedad para almacenar el libro seleccionado
    }
  },
  mounted() {
    this.getLibros();
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  width: 230px;
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
</style>
