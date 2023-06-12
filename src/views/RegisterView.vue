<template>
  <div class="home">
    <div class="container" style="padding: 15px;">
      <RegistroUsuario></RegistroUsuario>
    </div>
  </div>
</template>

<script>
import RegistroUsuario from '@/components/RegistroUsuario.vue'

export default {
  name: 'RegistroView',
  components: {
    RegistroUsuario
  },
}
</script>
