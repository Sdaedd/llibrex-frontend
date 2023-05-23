<template>
    <div class="reader-view">
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <EpubReader :book="selectedBook" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
import { mapState } from 'vuex';
import EpubReader from '@/components/EpubReader.vue';
  
  export default {
    name: 'ReaderView',
    components: {
      EpubReader
    },
    data() {
      return {
        readingBook: null,
      };
    },
    computed: {
    ...mapState(['selectedBook']), // Importa el estado selectedBook desde Vuex
    },
  };
  </script>
  
  <style scoped>
  .reader-view {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-top: 3rem;
  }
  
  .section {
    padding: 3rem 0;
  }
  </style>
  