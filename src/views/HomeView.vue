<template>
  <div class="home">
    
    <div class="container" style="padding: 15px;">
    <p class="title is-4 has-text-light">Tus libros</p>
    <hr>
    <CardLibro/>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import CardLibro from '@/components/CardLibro.vue'

export default {
  name: 'HomeView',
  components: {
    CardLibro
  }
}
</script>
