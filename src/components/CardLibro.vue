<template>
  <div class="columns is-mobile is-multiline">
    <div class="column is-one-fifth" v-for="libro in libros" :key="libro.id">
      <div class="card has-background-black-ter has-text-white">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="libro.image" alt="Imagen de {{libro.titulo}}" class="image">
            <div class="image-overlay"></div>
          </figure>
        </div>
        <div class="card-content">
          <div class="content title is-6 has-text-light">
            <p v-if="!libro.showAll">{{ libro.title.substring(0, 22) }}
              <a @click="libro.showAll = true">...</a>
            </p>
            <p v-else>{{ libro.title }} <a @click="libro.showAll = false">←</a></p>
            <p class="subtitle is-7 has-text-grey">{{ libro.authors[0].replace(",", " & ") }}</p>
          </div>
        </div>
      </div>
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
      currentSlide: 0
    }
  },
  mounted() {
    axios.get('http://localhost:3000/libros')
      .then(response => {
        this.libros = response.data.map(libro => ({ ...libro, showAll: false }));
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
.card {
  position: relative;
  height: 290px;
  width: 230px;
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
</style>
