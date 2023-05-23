<template>
  <div class="epub-reader">
    <div class="menu">
      <a class="navbar-item" href="/">
        <img src="../assets/logo.png" width="112" height="28">
      </a>
      <div class="menu-item">
        <span class="book-title">{{ book.title }}</span>
      </div>
      <div class="menu-item">
        <p><b>Página:</b></p>
        <span class="current-page">{{ currentPage + " / " + book.pageCount }}</span>
      </div>
    </div>
    <div id="reader" ref="reader"></div>
  </div>
</template>

<script>
import axios from 'axios';
import Epub from 'epubjs';

export default {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rendition: null,
      currentPage: 1,
    };
  },
  watch: {
    book(newBook) {
      this.renderBook(newBook);
    },
  },
  mounted() {
    this.renderBook(this.book);
    window.onbeforeunload = this.destroyRendition; // Handle browser back navigation
  },
  beforeUnmount() {
    this.destroyRendition();
  },
  methods: {
    renderBook(libro) {
      axios
        .get(`http://localhost:3000/libros/descargar/${libro._id}`)
        .then((response) => {
          const epubArray = new Uint8Array(response.data.epub);
          const book = Epub(epubArray.buffer);
          console.log(book)
          this.rendition = book.renderTo(this.$refs.reader, {
            method: 'continuous',
            width: '100%',
            height: 'calc(100% - 70px)',
          });
          this.rendition.display();

          // Enable navigation using arrow keys
          window.addEventListener('keydown', this.handleKeyDown);
          book.locations.generate().then(
            console.log(this.book.locations)
          );
          // Update current page
/*           this.rendition.on('relocated', (location) => {
            this.currentPage = location.start.cfi;
            console.log("book")
          }); */

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
  height: 50px;
  padding: 10px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.menu-item {
  display: flex;
  align-items: center;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
}

.current-page {
  font-size: 16px;
}

#reader {
  height: calc(100% - 70px);
}
</style>
