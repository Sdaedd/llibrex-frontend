<template>
    <div class="home">
      <div class="container" style="padding: 15px;">
        <LoginUsuario></LoginUsuario>
      </div>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import LoginUsuario from '@/components/LoginUsuario.vue'
  console.log(localStorage.getItem('userId'))
  export default {
    name: 'RegistroView',
    components: {
        LoginUsuario
    },
  }
  </script>
  