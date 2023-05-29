<template>
  <div class="panel shadow">
    <p class="panel-heading">Libros del usuario:</p>
    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" type="text" v-model="searchQuery" placeholder="Search">
        <span class="icon is-left">
          <i class="fas fa-search" aria-hidden="true"></i>
        </span>
      </p>
    </div>
    <div v-if="filteredLibros.length === 0" class="panel-block">
      <p class="has-text-white">No se encontraron libros.</p>
    </div>
    <div v-else>
      <div v-for="libro in filteredLibros" :key="libro._id" class="panel-block">
        <div class="book-info">
          <div class="book-title is-6 has-text-light">{{ libro.title }}
            <div class="subtitle is-7 has-text-grey">ID: {{ libro._id }}</div>
          </div>

          <div class="chapter-info">
            <div class="buttons">
              <button class="button is-danger" @click="borrarLibro(libro._id)">Borrar</button>
              <button class="button is-primary" @click="downloadBook(libro)">Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showNotification" class="notification is-success">
      ¡El libro se ha borrado exitosamente!
    </div>
  </div>
  <br/>
</template>

<script>
import axios from 'axios';

export default {
  emits: ['libroBorrado'],
  props: {
    libros: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      showNotification: false,
    };
  },
  computed: {
    filteredLibros() {
      const query = this.searchQuery.toLowerCase();
      return this.libros.filter(libro => libro.title.toLowerCase().includes(query));
    },
  },
  methods: {
    async downloadBook(libro) {
      const downloadUrl = `http://localhost:3000/libros/descargar/${libro._id}`;

      try {
        const response = await axios.get(downloadUrl, { responseType: 'blob' });
        const contentType = response.headers['content-type'];

        if (contentType === 'application/json') {
          this.error = response.data.message;
        } else {
          const blob = new Blob([response.data], { type: contentType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${libro.title}.epub`);
          link.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    borrarLibro(libroId) {
      axios
        .delete(`http://localhost:3000/libros/${libroId}`)
        .then(() => {
          // Eliminación exitosa, realizar acciones necesarias
          this.$emit('libroBorrado'); // Emitir evento para indicar que se borró el libro
          this.showNotification = true; // Mostrar la notificación de éxito
          setTimeout(() => {
            this.showNotification = false; // Ocultar la notificación después de un tiempo
          }, 3000);
        })
        .catch((error) => {
          // Manejar el error en caso de que ocurra
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.panel {
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.149);
}

.panel-heading {
  background-color: #3273dc;
  color: #fff;
}

.panel-block {
  display: flex;
  align-items: center;
}

.panel-block .book-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-block .book-info .book-title {
  font-weight: bold;
}

.panel-block .book-info .chapter-info .buttons {
  display: flex;
  flex-direction: column;
}

.button {
  width: 90px;
  margin-right: 0 !important;
}

.notification {
  margin-top: 1rem;
}
</style>
