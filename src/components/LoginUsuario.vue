<template>
  <div class="wrapper">
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
        .post(`${process.env.VUE_APP_API_BASE_URL}/usuarios/login`, usuario, {
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
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Asegura que el contenedor ocupe el 100% de la altura de la pantalla */
}
.login-container {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
  background-color: #363636;
  color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
}

.title {
  color: #fff;
  text-align: center; /* Centra el título horizontalmente */
  margin-bottom: 20px; /* Agrega espacio inferior */
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
  display: flex;
  justify-content: center; /* Centra los botones horizontalmente */
}

/* Estilos para hacer el formulario responsive */
@media (max-width: 600px) {
  .wrapper {
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;
  }

  .login-container {
    padding:5px;
    max-width: 100%;
  }

  .title {
    font-size: 24px;
  }
}
</style>