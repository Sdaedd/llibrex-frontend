<template>
    <body class="is-dark">
      <router-view/>
    </body>
</template>

<script>
// @ is an alias to /src


export default {
  created() {
    // Verificar si hay un usuario en el localStorage
    const user = localStorage.getItem('userId');

    // Si no hay un usuario o no es válido, redirigir a la página de inicio de sesión
    if (!user) {
      this.$router.push('/login');
    }
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
