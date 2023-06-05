<template>
  <div class="modal is-active" v-if="usuario">
    <div class="modal-background" @click="closePopup"></div>
    <div class="modal-card has-text-white">
      <header class="modal-card-head has-background-black-ter">
        <p class="modal-card-title has-text-light">{{ book.title }}</p>
        <button class="maximize-button" @click="maximizePopup">
          <i class="fas fa-expand"></i>
        </button>
        <button class="delete" aria-label="close" @click="closePopup"></button>
      </header>
      <section class="modal-card-body has-background-grey-darker">
        <div class="media">
          <div class="media-left">
            <figure class="image" :class="{'is-4by5': !showProgress}">
              <img v-if="book.image != ''" :src="book.image" alt="Book Cover" />
              <img v-else src="../assets/no-cover.jpg" alt="Book Cover" />
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              <div class="columns">
                <div class="column">
                  <p>
                    <strong class="has-text-grey-light title is-5"
                      >Autor/es:</strong
                    >
                    {{ book.authors === undefined ? 'deconocido' : book.authors.join(", ") }}
                  </p>
                  <p>
                    <strong class="has-text-grey-light title is-5"
                      >Editorial:</strong
                    >
                    {{ book.publisher }}
                  </p>
                  <p>
                    <strong class="has-text-grey-light title is-5"
                      >Género:</strong
                    >
                    {{ book.categories === undefined ? 'undefined' : book.categories.slice(0, 3).join(", ") }}
                  </p>
                </div>
                <div class="column">
                  <p>
                    <strong class="has-text-grey-light title is-5"
                      >ISBN:</strong
                    >
                    {{ book.isbn }}
                  </p>
                  <p>
                    <strong class="has-text-grey-light title is-5"
                      >Páginas:</strong
                    >
                    {{ book.pageCount === 0 ? "Desconocido" : book.pageCount }}
                  </p>
                  <p v-if="showProgress">
                    <strong class="has-text-grey-light title is-5"
                      >Valoración:</strong
                    >
                    <span class="comment-rating" v-if="this.valoraciones">
                      <span
                        v-for="star in 5"
                        :key="star"
                        class="icon has-text-black"
                      >
                        <i
                          class="fas fa-star"
                          :class="{
                            'has-text-warning': star <= this.getAverageRating(),
                          }"
                        ></i>
                      </span>
                      ({{ this.valoraciones.length }})
                    </span>
                  </p>
                  <p v-else>
                    <strong class="has-text-grey-light title is-5">
                      Más información:
                    </strong>
                    <a :href="book.link" class="button is-outlined is-primary">Link a Google Libros</a>
                  </p>
                </div>
              </div>
              <span v-if="showProgress">
                <button
                  class="button is-primary is-outlined is-small"
                  @click="leerLibro"
                >
                  <span class="is-size-6">Leer</span>
                  <span class="icon is-small">
                    <i class="fas fa-book-open"></i>
                  </span>
                </button>
                <button
                  class="button is-danger is-outlined is-small"
                  @click="borrarLibro"
                >
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
        <div
          v-if="showProgress"
          class="level-item has-text-centered progress-container"
        >
          <progress
            class="progress show-value is-large is-dark"
            :value="book.capituloActual"
            max="100"
          ></progress>
          <p class="progress-value has-text-grey">{{ book.capituloActual }}%</p>
        </div>

        <hr v-if="!showProgress"
          class="has-background-grey-light"
          style="margin-top: 2rem; margin-bottom: 2rem"
        />

        <div class="description-wrapper">
          <p>
            <strong class="has-text-grey-light title is-3">Sinopsis:</strong>
          </p>
          <div v-if="showFullDescription">
            <p>{{ book.description == undefined ? 'desconocido' : book.description}}</p>
            <button
              class="button is-small is-light is-outlined is-focused"
              @click="showFullDescription = false"
            >
              Mostrar menos
            </button>
          </div>
          <div v-else>
            <p>{{ book.description === undefined ?  'desconocido' : truncatedDescription }}</p>
            <button
              v-if="book.description != undefined && book.description.length > 450"
              class="button is-light is-outlined"
              @click="showFullDescription = true"
            >
              Mostrar más
            </button>
          </div>
        </div>
        <hr v-if="showProgress"
          class="has-background-grey-light"
          style="margin-top: 2rem; margin-bottom: 2rem"
        />
        <commentSection
          v-if="usuario && showProgress"
          :usuario="this.usuario"
          :libroId="book._id"
          @valoraciones="handleValoraciones"
        />
      </section>
      <footer class="modal-card-foot has-background-black-ter"></footer>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";
import commentSection from "@/components/commentSection.vue";

export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
    getValoraciones: {
      type: Number,
    },
  },
  components: {
    commentSection,
  },
  data() {
    return {
      usuario: [],
      showFullDescription: false,
      valoraciones: [], // Almacenar las valoraciones de los comentarios recibidos
    };
  },
  computed: {
    hasTruncatedDescription() {
      return this.book.description && this.book.description.length > 450;
    },
    truncatedDescription() {
      if (this.hasTruncatedDescription) {
        return this.book.description.slice(0, 650) + "...";
      }
      return this.book.description;
    },
  },
  mounted() {
    this.getUsuario();
  },
  methods: {
    ...mapMutations(["setSelectedBook"]),

    getUsuario() {
      const userId = localStorage.getItem("userId");
      axios
        .get(`http://localhost:3000/usuarios/${userId}`)
        .then((response) => {
          this.usuario = response.data;
        })
        .catch((error) => {
          this.error = error.message;
          console.error(error);
        });
    },

    leerLibro() {
      this.setSelectedBook(this.book);
      localStorage.setItem("currentBookId", this.book._id);
      this.$router.push({ name: "ReaderView" });
    },
    closePopup() {
      this.$emit("closePopup");
    },
    borrarLibro() {
      const libroId = this.book._id;

      axios
        .delete(`http://localhost:3000/libros/${libroId}`)
        .then(() => {
          this.$emit("closePopup");
          this.$emit("libroBorrado");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getAverageRating() {
      if (this.valoraciones.length === 0) {
        return 0; // Si no hay comentarios, la valoración promedio es 0
      }

      const totalValoraciones = this.valoraciones.reduce(
        (total, valoracion) => total + valoracion,
        0
      );
      const averageRating = totalValoraciones / this.valoraciones.length;

      return Math.round(averageRating); // Redondear la media al número entero más cercano
    },
    handleValoraciones(valoraciones) {
      this.valoraciones = valoraciones;
    },
    maximizePopup() {
      const modalCard = document.querySelector('.modal-card');
      modalCard.classList.toggle('maximized');

      const modalCardFoot = document.querySelector('.modal-card-foot')
      modalCardFoot.style.display = modalCardFoot.style.display == 'none' ? 'initial' : 'none';

      const modalCardHead = document.querySelector('.modal-card-head')
      modalCardHead.style.height = modalCardHead.style.height == '40px' ? 'initial' : '40px'
    },
  },
}
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

.modal-card-body .media-left  {
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

.maximized {
  padding: 10px;
  max-width: 100%;
  max-height: 100%;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  border-radius: 0 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 9999 !important;
}

.modal-header-buttons {
  display: flex;
  align-items: center;
}

.maximize-button {
  background: none;
  border: none;
  padding: 0.5rem;
  margin-right: 0.5rem;
  color: #fff;
  cursor: pointer;
}

.maximize-button:hover {
  color: #ccc;
}

.fa-expand {
  font-size: 1.2rem;
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
  .modal-card-head {
    height: 40px;
  }
}
</style>
