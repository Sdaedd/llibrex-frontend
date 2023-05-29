<template>
    <NavBar />
    <div class="tabs is-centered">
        <ul>
          <li><a href="/cuenta">Panel de Usuario</a></li>
          <li class="is-active"><a>Panel de administrador</a></li>
        </ul>
      </div> 
  <div>
    <AdminPanel />
  </div>
</template>

<script>
import AdminPanel from '@/components/AdminPanel.vue'
import NavBar from '@/components/NavBar.vue';


export default {
    components: {
        NavBar,
        AdminPanel
    },
    beforeRouteEnter(to, from, next) {
    const userIsadmin = localStorage.getItem('userRole') === 'admin';

    if (!userIsadmin) {
      next('/cuenta');
    } else {
      next();
    }
  },
}
</script>

<style>

</style>