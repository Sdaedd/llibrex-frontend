<template>
  <div class="carousel-container">
    <div class="carousel">
      <div class="carousel-item" v-for="libro in libros" :key="libro.id">
        <div class="card has-background-black-ter has-text-white my-card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img :src="libro.image" :alt="'Imagen de ' + libro.titulo" class="my-image">
              <div class="image-overlay"></div>
            </figure>
          </div>
          <div class="card-content">
            <div class="content title is-6 has-text-light">
              <p v-if="!showAll">{{ libro.title.substring(0, 19) }}
                <a @click="showAll = true">...</a>
              </p>
              <p v-else>{{ libro.title }} <a @click="showAll = false">←</a></p>
              <p class="subtitle is-7 has-text-grey">{{ libro.authors[0] }}<a v-if="libro.authors[1]" class="subtitle is-7 has-text-grey">{{ " & "+libro.authors[1].substring(0, 7)+"..."}}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="carousel-navigation">
      <button class="carousel-nav-prev" @click="prevSlide">
        <font-awesome-icon :icon="['fas', 'user']" />
      </button>
      <button class="carousel-nav-next" @click="nextSlide">
        <font-awesome-icon :icon="['fas', 'user']" />
      </button>
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
      showAll: false,
      currentSlide: 0
    }
  },
  mounted() {
    axios.get('http://localhost:3000/libros')
      .then(response => {
        this.libros = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },
    nextSlide() {
      if (this.currentSlide < this.libros.length - 1) {
        this.currentSlide++;
      }
    }
  }
}
</script>

<style>
.my-card {
  position: relative;
}

.my-image {
  position: relative;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, hsl(0, 0%, 14%) 5%, rgba(0, 0, 0, 0));
}

.carousel-container {
  position: relative;
  overflow: hidden;
}

.carousel {
  display: flex;
  transition: transform 0.3s ease;
}

.carousel-item {
  flex: 0 0 auto;
}

.carousel-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}
.carousel-nav-prev,
.carousel-nav-next {
background: transparent;
border: none;
color: white;
font-size: 24px;
padding: 0;
cursor: pointer;
transition: opacity 0.3s ease;
}

.carousel-nav-prev:hover,
.carousel-nav-next:hover {
opacity: 0.8;
}

.carousel-nav-prev {
margin-left: 10px;
}

.carousel-nav-next {
margin-right: 10px;
}
</style>
