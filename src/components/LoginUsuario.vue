<template>
  <div class="login-container">
    <h2 class="title">Iniciar sesión</h2>
    <form @submit.prevent="submitForm">
      <div class="field">
        <label class="label" for="nombre">Nombre de usuario:</label>
        <div class="control">
          <input class="input" type="text" id="nombre" v-model="nombre" required>
        </div>
      </div>
      <div class="field">
        <label class="label" for="contraseña">Contraseña:</label>
        <div class="control">
          <input class="input" type="password" id="contraseña" v-model="contraseña" required>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <div class="buttons is-centered">
            <button class="button is-white is-outlined" type="submit">Iniciar sesión</button>
            <a class="button is-primary is-outlined" href="/register">
              <strong>Registrarse</strong>
            </a>
          </div>
        </div>
      </div>
    </form>
    <div v-if="error">
      <br/>
      <p class="notification is-danger">{{ error }}</p>
    </div>    
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
    };
  },
  methods: {
    submitForm() {
      this.error = '';

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
        .then((res) => {
          // Manejar la respuesta exitosa del servidor
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', res.data.userId);
          this.nombre = '';
          this.contraseña = '';

          // Redireccionar a la página principal
          this.$router.push('/');
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
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #363636;
  color: #fff;
  border-radius: 5px;
}

.title {
  color: #fff;
}

.field label.label {
  color: #fff;
}

.field .input {
  background-color: #5a5a5a;
  color: #fff;
}

.notification.is-danger {
  background-color: #f14668;
  color: #fff;
}

.notification.is-success {
  background-color: #48c774;
  color: #fff;
}

.buttons.is-centered {
  padding-top: 8px;
}
</style>
