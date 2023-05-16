<template>
    <div>
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label for="nombre">Nombre de usuario:</label>
          <input type="text" id="nombre" v-model="nombre" required>
        </div>
        <div>
          <label for="contraseña">Contraseña:</label>
          <input type="password" id="contraseña" v-model="contraseña" required>
        </div>
        <button type="submit">Registrar</button>
      </form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">Usuario registrado correctamente.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        nombre: '',
        contraseña: '',
        error: '',
        success: false
      };
    },
    methods: {
      submitForm() {
        this.error = '';
        this.success = false;
  
        // Validar el formulario antes de enviar la solicitud al backend
        if (!this.nombre || !this.contraseña) {
          this.error = 'Por favor, complete todos los campos del formulario.';
          return;
        }
  
        // Verificar si el usuario ya existe antes de enviar la solicitud de registro
        this.verificarUsuarioExistente(this.nombre.trim())
          .then(() => {
            // Enviar la solicitud de registro al backend
            const usuario = {
              nombre: this.nombre.trim(),
              contraseña: this.contraseña
            };
  
            axios
              .post('http://localhost:3000/usuarios', usuario, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(() => {
                // Manejar la respuesta exitosa del servidor
                this.success = true;
                this.nombre = '';
                this.contraseña = '';
              })
              .catch(error => {
                // Manejar errores de la solicitud al servidor
                if (
                  error.response &&
                  error.response.data &&
                  error.response.data.message
                ) {
                  this.error = error.response.data.message;
                } else {
                  this.error = 'Ha ocurrido un error en el registro de usuario.';
                }
              });
          })
          .catch(error => {
            // Manejar el error de usuario existente
            this.error = error.message;
          });
      },
      verificarUsuarioExistente(nombreUsuario) {
        return new Promise((resolve, reject) => {
          // Realizar la verificación de existencia de usuario en el frontend
          // Hacer una solicitud al backend para verificar si el usuario ya existe
          // por ejemplo, una llamada a la ruta GET '/usuarios' para obtener todos los usuarios
          // y luego buscar si el nombre de usuario ya está presente en la lista de usuarios
  
          // Ejemplo de código:
          axios
            .get('http://localhost:3000/usuarios')
            .then(response => {
              const usuarios = response.data;
              const usuarioExistente = usuarios.find(usuario => usuario.nombre === nombreUsuario);
  
              if (usuarioExistente) {
                reject(new Error('El usuario ya está registrado.'));
              } else {
                resolve();
              }
            })
            .catch(error => {
              reject(error);
            });
        });
    }
}
};
</script>
<style scoped>
.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>