<template>
  <div class="wrapper">
    <div class="login-container">
      <h2 class="title">Registrate</h2>
      <form @submit.prevent="submitForm">
        <div class="field">
          <label class="label" for="nombre">Nombre de usuario:</label>
          <div class="control">
            <input class="input" type="text" id="nombre" v-model="nombre" required>
            <p class="error" v-if="nombreError">{{ nombreError }}</p>
          </div>
        </div>
        <div class="field">
          <label class="label" for="contraseña">Contraseña:</label>
          <div class="control">
            <input class="input" type="password" id="contraseña" v-model="contraseña" required>
            <p class="error" v-if="contraseñaError">{{ contraseñaError }}</p>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="buttons is-centered">
              <button class="button is-primary is-outlined" type="submit">
                <strong>Registrarse</strong>
              </button>
              <a class="button is-danger is-outlined" href="/login">Volver</a>
            </div>
          </div>
        </div>
      </form>
      <div v-if="error">
        <br />
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
      success: false
    };
  },
  computed: {
    nombreError() {
      if (this.nombre.length < 4 && this.nombre.length > 0) {
        return 'El nombre de usuario debe tener al menos 4 caracteres.';
      }

      if (/^[0-9]/.test(this.nombre)) {
        return 'El nombre de usuario no puede comenzar con un número.';
      }

      return '';
    },
    contraseñaError() {
      if (this.contraseña.length < 8 && this.contraseña.length > 0) {
        return 'La contraseña debe tener al menos 8 caracteres.';
      }
      return '';
    }
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
            nombre: this.nombre.trim().toLowerCase(),
            contraseña: this.contraseña
          };

          axios
            .post(`${process.env.VUE_APP_API_BASE_URL}/usuarios`, usuario, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(() => {
              // Manejar la respuesta exitosa del servidor
              this.success = true;
              this.nombre = '';
              this.contraseña = '';
              this.$router.push('/login');
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
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/usuarios`)
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
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
  color: #48c774;
  text-align: center;
  margin-bottom: 20px;
}

.field label.label {
  color: #fff;
}

.field .input {
  background-color: #5a5a5a;
  color: #fff;
  border-color: transparent;
}

.field .input:focus {
  border-color: #48c774;
  box-shadow: 0 0 0 0.125em rgba(72, 199, 116, 0.25);
}

.buttons.is-centered {
  padding-top: 8px;
}

.error {
  color: #ff3860;
}

@media (max-width: 600px) {
  .wrapper {
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;
  }

  .login-container {
    padding: 5px;
    max-width: 100%;
  }

  .title {
    font-size: 24px;
  }
}
</style>
