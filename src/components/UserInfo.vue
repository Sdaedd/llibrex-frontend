<template>
  <div v-if="success" class="notification is-success user-info">
    <button class="delete" @click="clearSuccess"></button>
    Usuario guardado correctamente.
  </div>
  <div class="user-info">
    <div class="field">
      <label class="label has-text-light">Acceso:</label>
      <div class="control has-icons-left">
        <input class="input" type="text" v-model="editedUsuario.acceso" disabled>
        <span class="icon is-small is-left">
          <i class="fas fa-hammer"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <label class="label has-text-light">Nombre:</label>
      <div class="control has-icons-left">
        <input class="input" type="text" v-model="editedUsuario.nombre" disabled>
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>
    <div class="field" v-if="editing">
      <label class="label has-text-light">Contraseña:</label>
      <div class="control has-icons-left">
        <input class="input" type="password" v-model="editedUsuario.contraseña" :disabled="!editing">
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="label has-text-light">Funciones:</label>
        <button class="button is-primary" @click="toggleEditing" v-if="!editing">Editar Contraseña</button>
        <button class="button is-success" @click="saveChanges" v-if="editing">Guardar</button>
        <button class="button is-light" @click="cancelEditing" v-if="editing">Cancelar</button>
      </div>
    </div>
  </div>
  <div v-if="error" class="notification is-danger panel">
    <button class="delete" @click="clearError"></button>
    {{ error }}
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    usuario: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      editedUsuario: null,
      error: '',
      success: false,
    };
  },
  created() {
    this.editedUsuario = { ...this.usuario };
  },
  methods: {
    toggleEditing() {
      this.editing = true;
    },
    async saveChanges() {
      try {
        const response = await axios.put(`http://localhost:3000/usuarios/${this.editedUsuario._id}`, this.editedUsuario);
        const usuarioActualizado = response.data;
        this.editing = false;
        this.success = true; // Mostrar notificación de éxito
        this.$emit('update:usuario', { ...usuarioActualizado });
      } catch (error) {
        console.error('Error al guardar los cambios del usuario:', error);
        // Manejar el error de acuerdo a tus necesidades
      }
    },
    cancelEditing() {
      this.editing = false;
      // Restaurar los datos originales del usuario
      this.editedUsuario = { ...this.usuario };
    },
    clearError() {
      this.error = '';
    },
    clearSuccess() {
      this.success = false;
    },
  },
};
</script>

<style scoped>
.user-info {
  max-width: 600px;
  margin: 2em auto;
  border-radius: 20px;
  border: gray 1px solid;
  padding: 15px;
  box-shadow: 0px 0px 10px 1px rgba(255, 255, 255, 0.149);
}

.user-info::before {
  filter: blur(20px);
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  font-weight: bold;
}

.has-text-light {
  color: #fff !important;
}

.button.is-primary.is-light {
  margin-left: 0.5rem;
}

input {
  color:gainsboro !important;
  background-color: transparent !important;
}

input::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgba(220, 220, 220, 0.573) !important;
  opacity: 1; /* Firefox */
}

input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: rgba(220, 220, 220, 0.573) !important;
}

input::-ms-input-placeholder { /* Microsoft Edge */
  color: rgba(220, 220, 220, 0.573) !important;
}

@media screen and (max-width: 768px) {
  .user-info,
  .panel {
    max-width: 100%;
  }
}
</style>
