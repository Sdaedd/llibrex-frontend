<!-- 

    Tal volta seria interesant segons chatgpt gastar de reader epub.js
  
 -->

<template>
    <body class="is-dark">
      <NavBar/>
      <router-view/>
    </body>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  }
}
</script>


<style>
html, body {
  margin: 0;
  height: 100%;
  background-color: #1a1a1a;
}
</style>
