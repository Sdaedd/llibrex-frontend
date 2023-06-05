<template>
  <div class="best-sellers">
    <select v-model="selectedGenre" @change="searchBooks">
      <option value="Misterio" selected="selected">Misterio</option>
      <option v-for="genre in genres" :key="genre[1]" :value="genre[1]">{{ genre[0] }}</option>
    </select>
    <SliderCard :libros="books" :showProgress="false" @bookSelected="showBookPopup" />
    <BookPopup :book="selectedBook" :showProgress="showProgress" v-if="selectedBook" @closePopup="selectedBook = null" />
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import SliderCard from './SliderCard.vue';
  import BookPopup from '@/components/BookPopup.vue';
  
  export default {
    components: {
      SliderCard,
      BookPopup
    },
    data() {
      return {
        books: [],
        selectedBook: null,
        showProgress: null,
        selectedGenre: 'Misterio',
        genres: [
        ['Accion', 'action'],
        ['Aventura', 'adventure'],
        ['Romance', 'romance'],
        ['Ciencia ficcion', 'science'],
        ['Fantasía', 'Fantasy'],
        ['Suspense', 'Suspense'],
        ['Drama', 'Drama'],
        ['Comedia', 'Comedy'],
        ['No ficción', 'Nonfiction']
      ]
      };
    },
    created() {
      this.searchBooks();
    },
    methods: {
      searchBooks() {
        const apiKey = 'AIzaSyAeN5D4nw0cPLBVXnBrS7umspy2tHytSjg';
  
        let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${this.selectedGenre}&langRestrict=es&key=${apiKey}`;  
        console.log(apiUrl)
        axios
          .get(apiUrl)
          .then((response) => {
            const booksData = response.data.items.map((data) => {
              return {
                googleId: data.id,
                title: data.volumeInfo.title,
                authors: data.volumeInfo.authors,
                description: data.volumeInfo.description,
                image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : "",
                publicationDate: data.volumeInfo.publishedDate,
                pageCount: data.volumeInfo.pageCount,
                publisher: data.volumeInfo.publisher,
                categories: data.volumeInfo.categories,
                isbn: data.volumeInfo.industryIdentifiers === undefined ? 'desconocido' : data.volumeInfo.industryIdentifiers[0].identifier,
                link: data.volumeInfo.infoLink
              };
            });
  
            this.books = booksData;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      showBookPopup(book) {
        console.log(book)
        this.selectedBook = book;
        this.showProgress = false;
      }
    }
  };
  </script>
  