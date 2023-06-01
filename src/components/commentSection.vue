<template>
  <div class="comments-section box has-background-grey-dark" v-if="comentarios">
    <div class="level">
    <h4 class="title is-3 has-text-grey-light">Comentarios</h4>
    <div class="field">
      <label class="label has-text-white">Ordenar por:</label>
      <div class="control">
        <div class="select">
          <select v-model="sortBy">
            <option value="">Ningun filtro</option>
            <option value="dateAsc">Más antiguos primero</option>
            <option value="dateDesc">Más nuevos primero</option>
            <option value="likesAsc">Comentarios menos gustados</option>
            <option value="likesDesc">Comentarios más gustados</option>
          </select>
        </div>
      </div>
    </div>
  </div>
    <hr/>
    <div class="comment media" v-for="comment in comentariosSorted" :key="comment._id">
      <div class="media-content" style="padding: 15px">
        <div class="content">
          <p class="has-text-white">
            <strong class="title is-4 has-text-grey-lighter">{{
              comment.usuario
            }}</strong>
            <br />
            <span v-for="star in 5" :key="star" class="icon has-text-black">
              <i
                class="fas fa-star"
                :class="{ 'has-text-warning': star <= comment.valoracion }"
              ></i>
            </span>
            
            
            
          </p>
          <span style="padding: 15px" class="has-text-white">{{ comment.contenido }}</span>
        </div>

        <nav class="level is-mobile">
          <div class="level-left">
            <a class="level-item"> </a>

            <a class="level-item" @click="likeComment(comment)">
              <span
                class="icon is-small"
                :class="{ 'has-text-danger': userHasLike(comment) }"
              >
                <i class="fas fa-heart"></i>
              </span>

              <span
                class="likes-count"
                :class="{ 'has-text-danger': userHasLike(comment) }"
              >
                {{ "(" + comment.likes.length + ")" }}
              </span>
            </a>
            <small class="has-text-grey-light">{{ formatDate(comment.fechaPublicacion) }}</small>
          </div>
          <div
            v-if="
              usuario.acceso === 'admin' || usuario.nombre == comment.usuario
            "
            class="level-right"
          >
            <a class="level-item" @click="deleteComment(comment._id)">
              <span class="icon is-small has-text-danger"
                ><i class="fas fa-trash"></i
              ></span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  <hr/>
  <form class="comment-form" @submit.prevent="submitComment()">
    <div class="field">
      <label class="label has-text-white">Nuevo comentario:</label>
      <div class="control">
        <textarea
          class="textarea transparent-bg white-border has-text-white"
          v-model="newComment.contenido"
          required
        ></textarea>
      </div>
    </div>
    <div class="field">
      <label class="label has-text-white">Valoración:</label>
      <div class="control">
        <div class="select">
          <select
            class="select transparent-bg white-border has-text-white"
            v-model="newComment.valoracion"
            required
          >
          <option selected disabled hidden value="" class="has-text-dark">
            Seleccione una valoración
          </option>
          <option class="has-background-grey" v-for="rating in 5" :key="rating" :value="rating">
            {{ rating }}
          </option>
          </select>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button type="submit" class="button is-primary">
          Enviar comentario
        </button>
      </div>
    </div>
  </form>
</div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    libroId: {
      type: String,
      required: true,
    },
    usuario: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comentarios: [],
      sortBy: '',
      newComment: {
        contenido: "",
        valoracion: "Seleccione una valoración",
      },
    };
  },
  mounted() {
    this.getComentarios();
  },
  computed: {
  comentariosSorted() {
    const comentariosCopy = [...this.comentarios]; // Copia del array original
    return comentariosCopy.sort((a, b) => {
      if (this.sortBy === "dateAsc") {
        return new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion);
      } else if (this.sortBy === "dateDesc") {
        return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
      } else if (this.sortBy === "likesAsc") {
        return a.likes.length - b.likes.length;
      } else if (this.sortBy === "likesDesc") {
        return b.likes.length - a.likes.length;
      } else {
        return 0; // No sorting
      }
    });
  },
},
  methods: {
    getComentarios() {
      axios
        .get(`http://localhost:3000/libros/${this.libroId}/comentarios`)
        .then((response) => {
          const comments = response.data;
          const commentsIds = comments.map((comment) => comment.comment);

          axios
            .get("http://localhost:3000/comentarios")
            .then((response) => {
              this.comentarios = response.data
                .filter((comment) => commentsIds.includes(comment._id))
                .map((comment) => ({
                  ...comment,
                }));

              const valoraciones = this.comentarios.map(
                (comment) => comment.valoracion
              );
              this.$emit("valoraciones", valoraciones);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitComment() {
      const commentData = {
        contenido: this.newComment.contenido,
        valoracion: this.newComment.valoracion,
        fechaPublicacion: new Date().toISOString(),
        usuario: this.usuario.nombre,
        libro: this.libroId,
      };
      axios
        .post(
          `http://localhost:3000/libros/${this.libroId}/comentarios`,
          commentData
        )
        .then(() => {
          this.newComment.contenido = "";
          this.newComment.valoracion = null;
          this.getComentarios();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteComment(commentId) {
      axios
        .delete(`http://localhost:3000/comentarios/${commentId}`)
        .then(() => {
          this.getComentarios();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    likeComment(comment) {
      const userId = this.usuario._id;
      if (this.userHasLike(comment)) {
        // Remove like
        axios
          .put(
            `http://localhost:3000/comentarios/${comment._id}/like/${userId}`
          )
          .then(() => {})
          .catch((error) => {
            console.error(error);
          });
      } else {
        // Add like
        axios
          .put(
            `http://localhost:3000/comentarios/${comment._id}/like/${userId}`
          )
          .then(() => {})
          .catch((error) => {
            console.error(error);
          });
      }
      this.getComentarios();
      this.userHasLike(comment);
    },
    userHasLike(comment) {
      const userId = this.usuario._id;
      const likes = comment.likes.map((like) => like._id);
      return likes.includes(userId.toString());
    },
    formatDate(date) {
    const now = new Date();
    const commentDate = new Date(date);

    const diffInMilliseconds = now - commentDate;
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `Hace ${diffInHours} hora/s`;
    } else {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return commentDate.toLocaleDateString('es-ES', options);
    }
  }
  },
};
</script>

<style scoped>
.comments-section {
  border: 1px solid white;
}

.transparent-bg {
  background-color: transparent;
}

.white-border {
  border: 1px solid white;
}
</style>
