<template>
  <div class="columns is-mobile is-multiline">
    <div class="column is-one-quarter" v-for="libro in libros" :key="libro.id">
      <div class="card has-background-black-ter has-text-white">
        <div class="card-image">
          <figure class="image is-4by3">
            <img :src="libro.image" alt="Imagen de {{libro.titulo}}">
          </figure>
        </div>
        <div class="card-content">
          <div class="content title is-5 has-text-light">
            <p v-if="!showAll">{{ libro.title.substring(0, 22) }}
              <a @click="showAll = true">...</a>
            </p>
            <p v-else>{{ libro.title }} <a @click="showAll = false">←</a></p>
            <p class="subtitle is-6 has-text-grey">{{ libro.authors[0] }}</p>
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
      showAll: false
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
  }
}
</script>
