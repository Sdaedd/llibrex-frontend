<template>
  <div>
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="nombre">Nombre de usuario:</label>
        <input type="text" id="nombre" v-model="nombre" required>
      </div>
      <div>
        <label for="contraseña">Contraseña:</label>
        <input type="password" id="contraseña" v-model="contraseña" required>
      </div>
      <button type="submit">Iniciar sesión</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">Inicio de sesión exitoso.</p>
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

      // Enviar la solicitud de inicio de sesión al backend
      const usuario = {
        nombre: this.nombre.trim(),
        contraseña: this.contraseña
      };

      axios
        .post('http://localhost:3000/usuarios/login', usuario, {
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
            this.error = 'Ha ocurrido un error en el inicio de sesión.';
          }
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
