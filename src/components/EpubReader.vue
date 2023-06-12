<template>
  <div v-if="book" class="epub-reader" @keydown="handleKeyDown">
    <!-- Top menu -->
    <div class="menu">
      <div class="menu-item">
        <a class="navbar-item" href="/">
          <img src="../assets/logo.png" width="112" height="28">
        </a>
        <a class="navbar-item" href="/biblioteca">
          <span class="icon is-large">
            <i class="fas fa-book"></i>
          </span>
        </a>
        <a class="navbar-item" href="/biblioteca"></a>
      </div>
      <div class="menu-item">
        <span class="book-title">{{ book.title }}</span>
      </div>
      <div class="menu-item">
        <span class="current-page">{{ calculateProgressPercentage() }}</span>
      </div>
    </div>
    <!-- Divider of reader -->
    <div class="divider"></div>
    <!-- reader -->
    <div id="reader" ref="reader"></div>
    <!-- Progress bar -->
    <div class="progress-bar">
      <div class="page-navigation">
        <button class="button" @click="prevPage"><i class="fas fa-chevron-left"></i></button>
        <div class="progress-slider" @mousemove="showProgressMessage($event)">
          <input type="range" class="slider" :value="currentLocation" :max="totalLocations" @input="goToLocation($event.target.value)">
          <span class="progress-message" v-if="showingProgressMessage">{{ progressMessage }}</span>
        </div>
        <button class="button" @click="nextPage"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Epub from 'epubjs';

export default {
  props: {
    book: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      rendition: null,
      currentLocation: null,
      totalLocations: null,
      epubCfi: null,
      showingProgressMessage: false,
      progressMessage: '',
    };
  },
  computed: {
    progress() {
      return this.totalLocations ? Math.floor((this.currentLocation / this.totalLocations) * 100) : 0;
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeyDown); // Agrega el listener para el evento 'keydown'
    const userId = localStorage.getItem('userId');

    if (this.book) {
      this.getUserLocation(userId, this.book._id)
        .then(() => {
          this.renderBook(this.book);
          window.onbeforeunload = this.destroyRendition; // Handle browser back navigation
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.$router.push('/');
    }
  },
  beforeUnmount() {
    this.destroyRendition();
  },
  methods: {
    getUserLocation(userId, libroId) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/usuarios/${userId}`)
          .then((response) => {
            const progresoLibros = response.data.progresoLibros;
            const libro = progresoLibros.find((progreso) => progreso.libro === libroId);
            if (libro) {
              this.epubCfi = libro.epubCfi;
              resolve(); // Resuelve la promesa si se encuentra el libro
            } else {
              console.error(`El libro con ID ${libroId} no fue encontrado en el progreso del usuario.`);
              reject(); // Rechaza la promesa si el libro no se encuentra
            }
          })
          .catch((error) => {
            console.error(error);
            reject(error); // Rechaza la promesa si ocurre un error en la solicitud
          });
      });
    },
    renderBook(libro) {
      if (!libro) {
        return; // Salir del método si libro es nulo
      }
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/libros/leer/${libro._id}`)
        .then((response) => {
          const epubArray = new Uint8Array(response.data.epub);
          const book = Epub(epubArray.buffer);

          this.rendition = book.renderTo(this.$refs.reader, {
            method: 'continuous',
            width: '100%',
            height: 'calc(100% - 2em)',
          });

          // Obtener las ubicaciones del libro
          book.ready.then(() => {
            this.totalLocations = book.locations.spine.length - 1;
          });

          // Actualizar la ubicación actual al cambiar de página
          this.rendition.on('relocated', (location) => {
            this.currentLocation = location.start.index;
            localStorage.setItem('currentLocation', location.start.cfi);
            localStorage.setItem('currentProgress', this.progress);
            this.chapters = this.rendition.book.locations.spine.manifest;
          });

          // Verificar si el CFI es válido antes de mostrarlo
          if (this.epubCfi == null) {
            this.rendition.display();
          } else {
            this.rendition.display(this.epubCfi);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    prevPage() {
      this.rendition.prev();
    },
    nextPage() {
      this.rendition.next();
    },
    goToLocation(location) {
      this.rendition.display(location);
    },
    handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        this.prevPage();
      } else if (event.key === 'ArrowRight') {
        this.nextPage();
      }
    },
    closeWindow() {
      this.destroyRendition();
      this.$router.push('/');
    },
    destroyRendition() {
      if (this.rendition) {
        this.rendition.destroy();
        this.rendition = null;
      }
    },
    showProgressMessage(event) {
      const progressBar = event.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const percentage = Math.floor((mouseX / rect.width) * 100);
      this.progressMessage = `${percentage}%`;
      this.showingProgressMessage = true;
    },
    calculateProgressPercentage() {
      if (this.totalLocations !== null && this.currentLocation !== null) {
        const percentage = Math.floor((this.currentLocation / this.totalLocations) * 100);
        return `${percentage}%`;
      }
      return '';
    },
  },
};
</script>

<style scoped>
.epub-reader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px black solid;
  overflow: hidden;
}

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 65px;
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.menu-item {
  display: flex;
  align-items: center;
}

.book-title {
  font-size: 1.5em;
  font-weight: bold;
}

#reader {
  height: calc(100% - 70px);
  width: 80%;
  margin: auto;
}

.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 50px;
  padding: 10px;
  background-color: #f8f8f8;
  border-top: 1px solid #ddd;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.page-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1px;
  flex-grow: 0;
  width: 100%;
}

.button {
  margin-right: 5px;
}

.button-next {
  margin-left: 5px;
}

.progress-slider {
  flex-grow: 1;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 90%;
}

.slider {
  width: 100%;
}

.divider {
  position: absolute;
  width: 1px;
  border-right: 1px #000 solid;
  height: 75%;
  z-index: 1;
  left: 50%;
  margin-left: -1px;
  top: 12.5%;
  opacity: 0.15;
  box-shadow: -3px 0 15px rgba(0, 0, 0, 1);
  display: block;
}

.current-page {
  display: flex;
  align-items: center;
  font-size: 22px;
}

.current-page span {
  margin-right: 5px;
}

.progress-message {
  position: absolute;
  top: -30px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.3s;
}


.progress-bar:hover .progress-message {
  opacity: 1;
}

@media only screen and (max-width: 1060px) {
  .divider {
    display: none;
  }

}
</style>
