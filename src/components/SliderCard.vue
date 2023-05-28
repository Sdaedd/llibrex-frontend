<template>
  <div class="carousel-wrapper">
    <carousel class="carousel" snapAlign="start" :itemsToShow="carouselItemsToShow" :transition="500" :itemsToScroll="carouselItemsToScroll">
      <slide v-for="libro in libros" :key="libro.id">
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
            <div class="content title is-6 has-text-light">
              <p v-if="!libro.showAll">
                {{ truncateTitle(libro.title, 42) }}
                <a v-if="libro.title.length > 42" @click="libro.showAll = true">...</a>
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
          <footer class="card-footer has-background-black-ter">
            <button class="button is-primary is-outlined is-small card-footer-item" @click="leerLibro(libro)">
              <span class="is-size-6">Leer</span>
              <span class="icon is-small">
                <i class="fas fa-book-open"></i>
              </span>
            </button>
          </footer>
        </div>
      </slide>
      <template #addons="{ slidesCount }">
        <navigation v-if="slidesCount > 6" />
      </template>
    </carousel>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';

export default {
  emits: ['bookSelected', 'readBook'],
  name: 'CardLibro',
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    libros: Array, // Add libros prop
  },
  data() {
    return {
      carouselItemsToShow: 5.45,
      carouselItemsToScroll: 1,
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapMutations(['setSelectedBook']),

    handleResize() {
      if (window.innerWidth < 1400 && window.innerWidth > 800) {
        this.carouselItemsToShow = 3.45;
        this.carouselItemsToScroll = 2;
      }
      else if(window.innerWidth < 800 && window.innerWidth > 570) {
        this.carouselItemsToShow = 2.45;
        this.carouselItemsToScroll = 1;
      }
      else if (window.innerWidth < 570){
        this.carouselItemsToShow = 1.15;
        this.carouselItemsToScroll = 1;
      }else{
        this.carouselItemsToShow = 5.45;
        this.carouselItemsToScroll = 3;
      }
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
    },

    leerLibro(libro) {
      this.setSelectedBook(libro);
      localStorage.setItem('currentBookId', libro._id);
      this.$router.push({ name: 'ReaderView' });
    },
  },
};
</script>

<style scoped>
.card {
  position: relative;
  width: 230px;
  height: 100%;
  flex-grow: 1;
}

.content {
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

.image:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid rgba(255, 255, 255, 0.439);
  border-radius: 5px;
  filter: blur(5px);
  cursor: pointer;
}

.modal-card-foot {
  height: 40px;
}

.carousel__slide {
  padding: 0.5em;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

@media screen and (max-width: 600px) {
  .card {
    width: 140px;
  }
}

</style>
