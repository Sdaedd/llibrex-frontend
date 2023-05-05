<template>
  <div class="home">
    <NavBar/>
    <CardLibro/>
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
