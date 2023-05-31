<template>
  <div class="modal is-active" v-if="usuario">
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
              <span v-if="showProgress">
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
              </span>
            </div>
          </div>
        </div>
        <br />
        <div v-if="showProgress" class="level-item has-text-centered progress-container">
          <progress class="progress show-value is-large is-dark" :value="book.capituloActual" max="100"></progress>
          <p class="progress-value has-text-grey">{{ book.capituloActual }}%</p>
        </div>

        <div class="description-wrapper">
          <p><strong class="has-text-grey-light title is-3">Sinopsis:</strong></p>
          <div v-if="showFullDescription">
            <p>{{ book.description }}</p>
            <button class="button is-small is-light is-outlined is-focused" @click="showFullDescription = false">Mostrar menos</button>
          </div>
          <div v-else>
            <p>{{ truncatedDescription }}</p>
            <button v-if="book.description.length > 450" class="button is-light is-outlined" @click="showFullDescription = true">Mostrar más</button>
          </div>
        </div>
        <hr class="has-background-grey-light" style="margin-top: 2rem; margin-bottom: 2rem;">

        <div class="comments-section" >
          <h4 class="title is-4 has-text-grey-light">Comentarios</h4>
          <div class="comment" v-for="comment in this.comentarios" :key="comment._id">
            <div class="columns">
              <div class="column">
                <p><strong>{{ comment.usuario }}</strong></p>
                <p>{{ comment.fechaPublicacion }}</p>
              </div>
              <div class="column">
                <p>{{ comment.contenido }}</p>
                <div class="comment-rating">
                  <span class="has-text-weight-bold">Valoración: </span>
                  <span v-for="star in comment.valoracion" :key="star" class="icon has-text-primary">
                    <i class="fas fa-star" :class="{ 'has-text-warning': star <= comment.valoracion }"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <form class="comment-form" @submit.prevent="submitComment()">
            <div class="field">
              <label class="label has-text-white">Nuevo comentario:</label>
              <div class="control">
                <textarea class="textarea" v-model="newComment.contenido" required></textarea>
              </div>
            </div>
            <div class="field">
              <label class="label has-text-white">Valoración:</label>
              <div class="control">
                <div class="select">
                  <select v-model="newComment.valoracion" required>
                    <option disabled value="">Seleccione una valoración</option>
                    <option v-for="rating in 5" :key="rating" :value="rating">{{ rating }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary">Enviar comentario</button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <footer class="modal-card-foot has-background-black-ter"></footer>
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
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      usuario: [],
      comentarios: [],
      showFullDescription: false,
      newComment: {
        contenido: '',
        valoracion: null,
      },
    };
  },
  computed: {
    hasTruncatedDescription() {
      return this.book.description && this.book.description.length > 450;
    },
    truncatedDescription() {
      if (this.hasTruncatedDescription) {
        return this.book.description.slice(0, 650) + '...';
      }
      return this.book.description;
    }
  },
  mounted() {
    this.getUsuario()
    this.getComentarios()
  },
  methods: {
    ...mapMutations(['setSelectedBook']),

    getUsuario() {
      const userId = localStorage.getItem('userId');
      axios.get(`http://localhost:3000/usuarios/${userId}`)
        .then(response => {
          this.usuario = response.data;
        })
        .catch(error => {
          this.error = error.message;
          console.error(error);
        });
    },

    getComentarios() {
  const libroId = this.book._id;

  axios
    .get(`http://localhost:3000/libros/${libroId}/comentarios`)
    .then((response) => {
      const comments = response.data;
      const commentsIds = comments.map((comment) => comment.comment);
      
      axios
        .get('http://localhost:3000/comentarios')
        .then((response) => {
          
          this.comentarios = response.data
            .filter((comment) => commentsIds.includes(comment._id))
            .map((comment) => ({
              ...comment,
            }));
            console.log(this.comentarios);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
},

    leerLibro() {
      this.setSelectedBook(this.book);
      localStorage.setItem('currentBookId', this.book._id);
      this.$router.push({ name: 'ReaderView' });
    },
    closePopup() {
      this.$emit('closePopup');
    },
    borrarLibro() {
      const libroId = this.book._id;

      axios
        .delete(`http://localhost:3000/libros/${libroId}`)
        .then(() => {
          this.$emit('closePopup');
          this.$emit('libroBorrado');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    submitComment() {
      const commentData = {
        contenido: this.newComment.contenido,
        valoracion: this.newComment.valoracion,
        fechaPublicacion: new Date().toISOString(),
        usuario: localStorage.getItem('userId'),
        libro: this.book._id
      };
      axios
        .post(`http://localhost:3000/libros/${this.book._id}/comentarios`, commentData)
        .then(() => {
          /* this.book.comments.push(response.data); */
          this.newComment.contenido = '';
          this.newComment.valoracion = null;
        })
        .catch(error => {
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
  height: auto;
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
  .modal-card-foot,
  .media-left {
    display: none;
  }
}
</style>
