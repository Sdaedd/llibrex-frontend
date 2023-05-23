// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    selectedBook: null,
  },
  mutations: {
    setSelectedBook(state, book) {
      state.selectedBook = book;
    },
  },
});
