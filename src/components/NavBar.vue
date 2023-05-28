<template>
  <div>
    <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="../assets/logo2.png" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger burger" :class="{ 'is-active': isNavbarActive }" data-target="navMenu" aria-label="menu" aria-expanded="false" @click="toggleNavbar">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" id="navMenu" :class="{ 'navbar-menu is-active has-background-grey-dark': isNavbarActive }">
        <div class="navbar-start">
          <a class="navbar-item" href="/">
            <span class="icon is-large">
              <i class="fas fa-home"></i>
            </span>
            Inicio
          </a>
          <a class="navbar-item" href="/biblioteca">
            <span class="icon is-large">
              <i class="fas fa-book"></i>
            </span>
            Biblioteca
          </a>
          <div class="navbar-item has-dropdown" :class="{ 'is-active': isDropdownOpen }">
            <a class="navbar-link"  @click="toggleDropdown">
              <span class="icon is-large">
                <i class="fas fa-upload"></i>
              </span>
              Subir
            </a>

            <div class="navbar-dropdown has-background-black-ter">
              <div class="navbar-item">
                <upload-libro></upload-libro> 
              </div>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <a class="navbar-item" href="/cuenta">
            <span class="icon is-large">
              <i class="fas fa-user"></i>
            </span>
            Cuenta
          </a>
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-danger is-outlined" @click="logOut" href="/login">
                Salir
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import UploadLibro from "@/components/UploadLibro.vue";

export default {
  components: {
    UploadLibro, // Agregar el componente UploadLibro.vue como un componente importado
  },
  data() {
    return {
      isNavbarActive: false, // Variable para controlar el estado del navbar
      isDropdownOpen: false, // Variable para controlar el estado del dropdown
    };
  },
  methods: {
    logOut() {
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.setItem('userId', null);
    },
    toggleNavbar() {
      this.isNavbarActive = !this.isNavbarActive; // Alternar el estado del navbar al hacer clic en el botón "navbar-burger"
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen; // Alternar el estado del dropdown al hacer clic en el enlace "Subir"
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados para el componente NavBar.vue */

.navbar-dropdown {
  padding: 0.5rem;
}

.navbar-item, .navbar-link {
  color: white;
}

.navbar-start > .navbar-item:hover, .navbar-end > .navbar-item:hover, .navbar-link:hover {
  background-color: 	hsl(0, 0%, 48%);
  color: white;
}

</style>
