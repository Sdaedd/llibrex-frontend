<template>
  <div class="home">
    <NavBar/>
    <div class="container" style="padding: 15px;">
    <p class="title is-4 has-text-light">Tus libros</p>
    <hr>
    <CardLibro/>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
import CardLibro from '@/components/CardLibro.vue'

export default {
  name: 'HomeView',
  components: {
    NavBar,
    CardLibro
  }
}
</script>
