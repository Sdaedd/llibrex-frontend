<template>
    <div class="search-bar">
      <input class="input" type="text" v-model="searchQuery" placeholder="Buscar por título" @input="filterBooks" />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      filterBooks() {
        this.$emit('filter', this.searchQuery);
      },
    },
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 1rem;
  }
  </style>
  