<template>
  <div class="search-bar">
    <div class="control has-icons-left">
      <input class="input" type="text" v-model="searchQuery" placeholder="Buscar por título" @input="filterBooks" />
      <span class="icon is-small is-left">
        <i class="fas fa-search"></i>
      </span>
    </div>
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

input {
  color: gainsboro;
  background-color: transparent;
}

input::placeholder {
  color: rgba(220, 220, 220, 0.573);
  opacity: 1;
}

input:-ms-input-placeholder {
  color: rgba(220, 220, 220, 0.573);
}

input::-ms-input-placeholder {
  color: rgba(220, 220, 220, 0.573);
}
</style>