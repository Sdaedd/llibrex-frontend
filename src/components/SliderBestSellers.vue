<template>
    <div class="best-sellers">
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
        showProgress: null
      };
    },
    created() {
      this.getBestSellers();
    },
    methods: {
      getBestSellers() {
        const apiKey = 'AIzaSyAeN5D4nw0cPLBVXnBrS7umspy2tHytSjg';
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const lastMonth = currentDate.getMonth(); // Los meses comienzan en cero
  
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:popularity&maxResults=10&key=${apiKey}&country=US&startDate=${currentYear}-${lastMonth}-01&endDate=${currentYear}-${lastMonth}-31`;
  
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
                isbn: data.volumeInfo.industryIdentifiers[0].identifier
              };
            });
  
            console.log(apiUrl);
            console.log(booksData);
  
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
  