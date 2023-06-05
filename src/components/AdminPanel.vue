<template>
  <div class="container">
    <div class="panel">
      <p class="panel-heading">Panel de Usuarios</p>
      <div class="panel-block">
        <input class="input" v-model="busqueda" placeholder="Ingrese el nombre del usuario o acceso" />
      </div>
      <div class="panel-block" v-for="usuario in usuariosFiltrados" :key="usuario._id">
        <div class="user-info">
          <div class="user-name has-text-white"><b>Usuario:</b> {{ usuario.nombre }}</div>
          <div class="user-password has-text-white"><b>Contraseña:</b> {{ usuario.contraseña }}</div>
          <div class="user-id has-text-grey"><b>Acceso:</b> {{ usuario.acceso }}</div>
          <div class="user-id has-text-grey"><b>ID:</b> {{ usuario._id }}</div>
          <div class="user-id has-text-grey"><b>Libros:</b> [{{ usuario.progresoLibros.length }}]</div>
        </div>
        <div>
          <button class="button is-danger" @click="eliminarUsuario(usuario._id)">Eliminar</button>
          <br />
          <button class="button is-info" @click="editarUsuario(usuario)">Editar</button>
        </div>
      </div>
    </div>
    <div v-if="mostrarPanelEdicion" class="modal is-active">
      <div class="modal-background" @click="mostrarPanelEdicion = false"></div>
      <div class="modal-content">
        <div class="box has-background-black-ter">
          <div class="container border">
            <h3 class="title is-4 has-text-white">Editar Usuario</h3>
            <div class="field">
              <label class="label has-text-white">Nombre de usuario</label>
              <div class="control">
                <input class="input" v-model="usuarioEditado.nombre" placeholder="Nombre de usuario" />
              </div>
            </div>
            <div class="field">
              <label class="label has-text-white">Contraseña</label>
              <div class="control">
                <input class="input" v-model="usuarioEditado.contraseña" placeholder="Contraseña" />
              </div>
            </div>
            <div class="field">
              <label class="label has-text-white">Acceso</label>
              <div class="control">
                <div class="select">
                  <select v-model="usuarioEditado.acceso">
                    <option value="admin">admin</option>
                    <option value="usuario">usuario</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-primary" @click="guardarUsuarioEditado">Guardar</button>
              </div>
            </div>
          </div>
          <hr />
          <book-panel :libros="librosUsuario" @libroBorrado="handleLibroBorrado" />
          <button class="modal-close is-large" aria-label="close" @click="mostrarPanelEdicion = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BookPanel from './BookPanel.vue';

export default {
  components: {
    BookPanel,
  },
  props: {
    usuarios: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      usuariosFiltrados: [],
      mostrarPanelEdicion: false,
      librosUsuario: [],
      usuarioEditado: {
        _id: '',
        nombre: '',
        contraseña: '',
        acceso: '',
      },
      busqueda: '',
    };
  },
  methods: {
    eliminarUsuario(usuarioId) {
      axios
        .delete(`http://localhost:3000/usuarios/${usuarioId}`)
        .then(() => {
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error(error);
        });
    },
    editarUsuario(usuario) {
      this.mostrarPanelEdicion = true;
      this.usuarioEditado = {
        _id: usuario._id,
        nombre: usuario.nombre,
        contraseña: usuario.contraseña,
        acceso: usuario.acceso,
      };
      this.verLibros(usuario._id);
    },
    guardarUsuarioEditado() {
      axios
        .put(`http://localhost:3000/usuarios/${this.usuarioEditado._id}`, this.usuarioEditado)
        .then(() => {
          this.mostrarPanelEdicion = false;
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error(error);
        });
    },
    verLibros(usuarioId) {
      axios
        .get(`http://localhost:3000/usuarios/${usuarioId}/libros`)
        .then((response) => {
          const progresoLibros = response.data;
          const libroIds = progresoLibros.map((libro) => libro.libro);

          axios
            .get('http://localhost:3000/libros')
            .then((response) => {
              this.librosUsuario = response.data
                .filter((libro) => libroIds.includes(libro._id))
                .map((libro) => ({
                  ...libro,
                  showAll: false,
                  capituloActual: progresoLibros.find((progreso) => progreso.libro === libro._id)?.capituloActual || 0,
                }));
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleLibroBorrado() {
      this.verLibros(this.usuarioActual);
    },
    obtenerUsuarios() {
      axios
        .get('http://localhost:3000/usuarios')
        .then((response) => {
          this.usuariosFiltrados = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  watch: {
    busqueda(nuevaBusqueda) {
      this.usuariosFiltrados = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(nuevaBusqueda.toLowerCase()) ||
        usuario.acceso.toLowerCase().includes(nuevaBusqueda.toLowerCase())
      );
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
  max-width: 90%;
}
.container.border {
  margin: 20px;
}

.panel {
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.249);
}

.panel-heading {
  background-color: rgb(240, 227, 157) ;
  color: black;
  font-size: 1.5rem;
  padding: 1rem;
}

.panel-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-color: rgb(240, 227, 157);
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

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.5) !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-content {
  max-height: 80%;
  width: 1000px;
  max-width: 100%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.border {
  border: rgb(240, 227, 157) solid 1px;
  border-radius: 20px;
}

@media screen and (max-width: 1000px) {
  .modal-content {
    max-height: 100%;
  }
}

input, select {
  color: gainsboro;
  background-color: transparent;
  border: rgb(240, 227, 157) solid 1px
}

input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgba(220, 220, 220, 0.573);
  opacity: 1; /* Firefox */
}

input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgba(220, 220, 220, 0.573);
}

input::-ms-input-placeholder { /* Microsoft Edge */
  color: rgba(220, 220, 220, 0.573);
}
</style>
