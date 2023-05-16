<template>
  <div>
    <form @submit.prevent="parseEpub">
      <div class="file has-name is-boxed">
        <label class="file-label">
          <input class="file-input is-black" type="file" name="file" @change="handleFileUpload" />
          <span class="file-cta has-background-dark">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label has-text-white"> Elige un archivo... </span>
          </span>
          <span class="file-name has-text-white">
            {{ file ? file.name : "No hay archivo seleccionado" }}
          </span>
        </label>
      </div>
      <button v-if="!bookData" class="button is-black" type="submit" :disabled="!file">
        Subir EPUB
      </button>
    </form>
  </div>
</template>

<script>
import ePub from "epubjs";
import axios from "axios";
import router from "@/router"

export default {
  data() {
    return {
      file: null,
      bookData: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async parseEpub() {
      if (this.file) {
        this.book = ePub(this.file);
        await this.book.ready;
        const metadata = this.book.package.metadata;
        var searchId = metadata.identifier.replace("urn:", "");
        if (!searchId.includes("isbn")) {
          searchId = metadata.title;
        }
        console.log(metadata)
        this.searchOnGoogleBooks(searchId);
      }
    },
    searchOnGoogleBooks(searchId) {
      const apiKey = "AIzaSyAeN5D4nw0cPLBVXnBrS7umspy2tHytSjg";
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchId}&key=${apiKey}`;
      console.log(searchUrl)
      axios
        .get(searchUrl)
        .then((response) => {
          if (response.data.items && response.data.items.length > 0) {
            const data = response.data.items[0];
            console.log(data);
            this.bookData = {
              googleId: data.id,
              title: data.volumeInfo.title,
              authors: data.volumeInfo.authors,
              description: data.volumeInfo.description,
              image: data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : "",
              publicationDate: data.volumeInfo.publishedDate,
              pageCount: data.volumeInfo.pageCount,
              publisher: data.volumeInfo.publisher,
              categories: data.volumeInfo.categories,
              isbn: data.volumeInfo.industryIdentifiers[0].identifier,
              epub: null, // Set it to null initially
            };
            this.saveBook()
          } else {
            console.log("No se encontraron libros.");
          }
        })
        .catch((error) => {
          console.error("Error retrieving book data:", error);
        });
    },
    async saveBook() {
      try {
        const formData = new FormData();
        formData.append("epub", this.file);        // Append the rest of the book data to FormData
        formData.append("googleId", this.bookData.googleId);
        formData.append("title", this.bookData.title);
        formData.append("authors", this.bookData.authors);
        formData.append("description", this.bookData.description);
        formData.append("image", this.bookData.image);
        formData.append("publicationDate", this.bookData.publicationDate);
        formData.append("pageCount", this.bookData.pageCount);
        formData.append("publisher", this.bookData.publisher);
        formData.append("categories", this.bookData.categories);
        formData.append("isbn", this.bookData.isbn);

        const response = await axios.post("http://localhost:3000/libros", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type for FormData
          },
        });
        console.log("Book saved successfully:", response.data);
        router.go();
      } catch (error) {
        console.error("Error saving book:", error);
      }
    },
  },
};
</script>