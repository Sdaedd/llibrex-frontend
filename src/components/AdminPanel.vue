<template>
    <div class="container">
      <div class="panel">
        <p class="panel-heading">Usuarios</p>
        <div class="panel-block" v-for="usuario in usuarios" :key="usuario._id">
          <div class="user-info">
            <div class="user-name has-text-white"><b>Usuario:</b> {{ usuario.nombre }}</div>
            <div class="user-password has-text-white"><b>Contraseña:</b> {{ usuario.contraseña }}</div>
            <div class="user-id has-text-grey"><b>ID:</b> {{ usuario._id }}</div>
          </div>
          <div>
            <button class="button is-danger" @click="eliminarUsuario(usuario._id)">Eliminar</button>
            <br />
            <button class="button is-info" @click="verLibros(usuario)">Ver Libros</button>
          </div>
        </div>
      </div>
      <book-panel v-if="mostrarPanelLibros" :libros="librosUsuario" @cerrarPanel="cerrarPanelLibros" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import BookPanel from './BookPanel.vue';
  
  export default {
    components: {
      BookPanel,
    },
    data() {
      return {
        usuarios: [],
        mostrarPanelLibros: false,
        librosUsuario: [],
      };
    },
    methods: {
      obtenerUsuarios() {
        axios.get('http://localhost:3000/usuarios')
          .then(response => {
            this.usuarios = response.data;
          })
          .catch(error => {
            console.error(error);
          });
      },
      eliminarUsuario(usuarioId) {
        axios.delete(`http://localhost:3000/usuarios/${usuarioId}`)
          .then(() => {
            // Eliminación exitosa del usuario
            // Actualizar la lista de usuarios
            this.obtenerUsuarios();
          })
          .catch(error => {
            console.error(error);
          });
      },
      verLibros(usuario) {
        axios.get(`http://localhost:3000/libros/${usuario._id}`)
          .then(response => {
            this.librosUsuario = response.data;
            if(this.librosUsuario.length > 0)
            this.mostrarPanelLibros = true;
          })
          .catch(error => {
            console.error(error);
          });
      },
      cerrarPanelLibros() {
        this.mostrarPanelLibros = false;
        this.librosUsuario = [];
      },
    },
    created() {
      this.obtenerUsuarios();
    },
  };
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  
  .panel {
    max-width: 800px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.249);
  }
  
  .panel-heading {
    background-color: hsl(0, 0%, 71%);
    color: #fff;
    font-size: 1.5rem;
    padding: 1rem;
  }
  
  .panel-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .user-id {
    font-size: 0.7em;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .button {
    width: 90px;
    margin: 5px 0;
  }
  
  .shadow {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  