<template>
  <div class="modal is-active">
    <div class="modal-background" @click="closePopup"></div>
    <div class="modal-card has-text-white">
      <header class="modal-card-head has-background-black-ter">
        <p class="modal-card-title has-text-light">{{ book.title }}</p>
        <button class="delete" aria-label="close" @click="closePopup"></button>
      </header>
      <section class="modal-card-body has-background-grey-dark">
        <div class="media">
          <div class="media-left">
            <figure class="image">
              <img :src="book.image" alt="Book Cover">
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <div class="columns">
                <div class="column">
                  <p><strong class="has-text-grey-light title is-5">Autor/es:</strong> {{ book.authors.join(', ') }}</p>
                  <p><strong class="has-text-grey-light title is-5">Editorial:</strong> {{ book.publisher }}</p>
                  <p><strong class="has-text-grey-light title is-5">Género:</strong> {{ book.categories.slice(0, 3).join(', ') }}</p>
                </div>
                <div class="column">
                  <p><strong class="has-text-grey-light title is-5">ISBN:</strong> {{ book.isbn }}</p>
                  <p><strong class="has-text-grey-light title is-5">Páginas:</strong> {{ book.pageCount === 0 ? 'Desconocido' : book.pageCount }}</p>
                  <p><strong class="has-text-grey-light title is-5">Valoración:</strong> {{ book.rating }}</p>
                </div>
              </div>
              <button class="button is-primary is-outlined is-small" @click="leerLibro">
                <span class="is-size-6">Leer</span>
                <span class="icon is-small">
                  <i class="fas fa-book-open"></i>
                </span>
              </button>
              <button class="button is-danger is-outlined is-small" @click="borrarLibro">
                <span class="is-size-6">Borrar</span>
                <span class="icon is-small">
                  <i class="fas fa-times"></i>
                </span>
              </button>
  
            </div>
          </div>
        </div>
        <br />
        <div class="level-item has-text-centered progress-container">
          <progress class="progress show-value is-large is-dark" :value="book.capituloActual" max="100"></progress>
          <p class="progress-value has-text-grey">{{ book.capituloActual }}%</p>
        </div>

        <div class="description-wrapper">
          <p><strong class="has-text-grey-light title is-3">Sinopsis:</strong></p>
          <div v-if="showFullDescription">
            <p>{{ book.description }}</p>
            <button class="button is-small is-light is-outlined is-focused" @click="showFullDescription = false">Mostrar menos</button>
          </div>
          <div v-else-if="hasTruncatedDescription">
            <p>{{ truncatedDescription }}</p>
            <button v-if="book.description.length > 450" class="button is-light is-outlined" @click="showFullDescription = true">Mostrar más</button>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot has-background-black-ter">
        <!-- Contenido del pie de página si es necesario -->
      </footer>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showFullDescription: false
    };
  },
  computed: {
    hasTruncatedDescription() {
      return this.book.description && this.book.description.length;
    },
    truncatedDescription() {
      if (this.hasTruncatedDescription && this.book.description.length > 450) {
        return this.book.description.slice(0, 650) + '...';
      }
      return this.book.description;
    }
  },
  methods: {
    ...mapMutations(['setSelectedBook']), // Importar la mutación setSelectedBook

    leerLibro() {
      this.setSelectedBook(this.book); // Almacenar el libro seleccionado en Vuex
      localStorage.setItem('currentBookId', this.book._id);
      this.$router.push({ name: 'ReaderView' }); // Redirigir a la vista ReaderView
    },
    closePopup() {
      this.$emit('closePopup');
    },
    borrarLibro() {
      const libroId = this.book._id;

      axios
        .delete(`http://localhost:3000/libros/${libroId}`)
        .then(() => {
          // Eliminación exitosa, realizar acciones necesarias
          this.$emit('closePopup'); // Emitir evento para cerrar el popup
          this.$emit('libroBorrado'); // Emitir evento para indicar que se borró el libro
        })
        .catch((error) => {
          // Manejar el error en caso de que ocurra
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
.modal {
  padding-bottom: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-card {
  width: 80%;
  height: 80%;
  max-width: 1000px;
  max-height: 700px;
  overflow-y: auto;
  border-radius: 8px;
}

.modal-card-head {
  background-color: #363636;
}

.modal-card-title {
  flex-grow: 1;
  color: #fff;
}

.modal-card-body {
  padding-bottom: 5px !important;
  padding: 1.5rem;
  font-size: large;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.modal-card-footer {
  background-color: #363636;
}

.modal-card-body .media-left .image {
  width: 178px;
  /* Ajustar el ancho de la imagen según sea necesario */
  height: auto;
  /* Esto permite que la altura se ajuste automáticamente para mantener la proporción de la imagen */
}

.content {
  padding-left: 15px;
}

.button {
  margin-top: 0.5rem;
}

.button.is-primary,
.button.is-danger {
  padding: 30px 0px;
  width: 100%;
  display: flex;
}

.delete {
  opacity: 0.7;
}

.delete:hover {
  opacity: 1;
}

.progress {
  border: white solid 1px;
}

.progress-container {
  position: relative;
  margin: 10px;
}

.progress-value {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: calc(1rem / 1.5);
  line-height: 1rem;
  font-weight: bold;
  text-shadow: 0px 0px 25px black;
}

.description-wrapper {
  margin-top: 1rem;
}

.progress.is-small + .progress-value {
  font-size: calc(0.75rem / 1.5);
  line-height: 0.75rem;
}

.progress.is-medium + .progress-value {
  font-size: calc(1.25rem / 1.5);
  line-height: 1.25rem;
}

.progress.is-large + .progress-value {
  font-size: calc(1.5rem / 1.5);
  line-height: 1.5rem;
}

/* Estilos específicos para dispositivos móviles */
@media screen and (max-width: 900px) {
  .modal-card {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
  }

  .modal-card-body {
    font-size: medium;
  }
  .modal-card-foot, .media-left {
    display: none;
  }
}
</style>
