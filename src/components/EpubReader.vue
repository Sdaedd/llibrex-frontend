<template>
  <div v-if="book" class="epub-reader">
    <!-- Top menu -->
    <div class="menu">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.png" width="112" height="28">
      </a>
      <div class="menu-item">
        <span class="book-title">{{ book.title }}</span>
      </div>
      <div class="menu-item">
      </div>
    </div>
    <!-- Divider of reader -->
    <div class="divider"></div>
    <!-- reader -->
    <div id="reader" ref="reader"></div>
    <!-- Progress bar -->
      <div class="progress-bar">
      <progress class="progress is-dark is-large" :value="this.currentLocation" :max="this.totalLocations"></progress>
      <div class="page-navigation">
        <button class="button" @click="prevPage"><i class="fas fa-chevron-left"></i></button>
        <div class="current-page">
          <span>{{ currentLocation }}</span>
          <span>/</span>
          <span>{{ totalLocations }}</span>
          <span class="progress-percentage">({{ progress }}%)</span>
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
      totalLocations: null
    };
  },
  watch: {
    book(newBook) {
      this.renderBook(newBook);
    },
  },
  computed: {
    progress() {
      if (this.totalLocations) {
        return Math.floor((this.currentLocation / this.totalLocations) * 100);
      }
      return 0;
    }
  },
  mounted() {
    if (this.book) {
      this.renderBook(this.book);
      window.onbeforeunload = this.destroyRendition; // Handle browser back navigation
    }else{
      this.$router.push('/');
    }
  },
  beforeUnmount() {
    this.destroyRendition();
  },
  methods: {
    renderBook(libro) {
      if (!libro) {
        return; // Salir del método si libro es nulo
      }
      axios
        .get(`http://localhost:3000/libros/descargar/${libro._id}`)
        .then((response) => {
          const epubArray = new Uint8Array(response.data.epub);
          const book = Epub(epubArray.buffer);
          this.rendition = book.renderTo(this.$refs.reader, {
            method: 'continuous',
            width: '100%',
            height: 'calc(100% - 2em)',
          });

          this.rendition.themes.default({ "p": { "font-size": "large !important"}})

          this.rendition.display();

          // Obtener las ubicaciones del libro
          book.ready.then(() => {
            this.totalLocations = book.locations.spine.length - 1;
          });

          // Actualizar la ubicación actual al cambiar de página
          this.rendition.on('relocated', (location) => {
            this.currentLocation = location.start.index;
            console.log(this.currentLocation)
          });

          // Enable navigation using arrow keys
          window.addEventListener('keydown', this.handleKeyDown);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleKeyDown(event) {
      // Handle arrow key navigation
      const arrowKeys = ['ArrowLeft', 'ArrowRight'];
      if (arrowKeys.includes(event.key)) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') {
          this.rendition.prev();
        } else if (event.key === 'ArrowRight') {
          this.rendition.next();
        }
      }
    },
    prevPage() {
      this.rendition.prev();
    },
    nextPage() {
      this.rendition.next();
    },
    closeWindow() {
      this.destroyRendition();
      this.$router.push('/');
    },
    destroyRendition() {
      if (this.rendition) {
        this.rendition.destroy();
        this.rendition = null;
        window.removeEventListener('keydown', this.handleKeyDown);
      }
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

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
  max-height: 50px;
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

.progress {
  flex-grow: 1;
  margin: auto;
  margin-right: 10px;
  width: 70%; 
}
.progress-percentage {
  margin-left: 5px;
}

.current-page {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.page-navigation {
  display: flex;
  align-items: center;
  margin: 1px;
  flex-grow: 0; 
}

.button {
  margin-right: 5px;
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
  opacity: .15;
  box-shadow: -3px 0 15px rgba(0, 0, 0, 1);
  display: block;
}

.current-page {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.current-page span {
  margin-right: 5px;
}

@media only screen and (max-width: 1000px) {
  .divider {
    display: none;
  }

  .menu {
    display: none;
  }
}
</style>
