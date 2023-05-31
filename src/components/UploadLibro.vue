<template>
  <div>
    <form @submit.prevent="parseEpub">
      <div class="file has-name is-boxed">
        <label class="file-label">
          <input
            class="file-input is-black"
            type="file"
            name="file"
            @change="handleFileUpload"
          />
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
      <button
        v-if="!bookData"
        class="button is-black mt-3"
        type="submit"
        :disabled="!file"
      >
        Subir EPUB
      </button>
      <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import ePub from "epubjs";
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      file: null,
      bookData: null,
      allowedExtensions: [".epub"], // Extensiones de archivo permitidas
      errorMessage: null, // Mensaje de error en caso de archivo no válido
    };
  },
  methods: {
    handleFileUpload(event) {
      const selectedFile = event.target.files[0];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (this.allowedExtensions.includes(`.${fileExtension}`)) {
        this.file = selectedFile;
        this.errorMessage = null; // Limpiar mensaje de error si el archivo es válido
      } else {
        this.file = null;
        this.errorMessage =
          "Archivo no válido. Por favor, selecciona un archivo EPUB.";
      }
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
        await this.searchOnGoogleBooks(searchId);
      }
    },
    async searchOnGoogleBooks(searchId) {
      try {
        const apiKey = "AIzaSyAeN5D4nw0cPLBVXnBrS7umspy2tHytSjg"; // Reemplaza con tu clave de API de Google Books
        const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchId}&key=${apiKey}`;
        console.log(searchUrl);
        const response = await axios.get(searchUrl);

        if (response.data.items && response.data.items.length > 0) {
          const data = response.data.items[0];
          this.bookData = {
            googleId: data.id,
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors,
            description: data.volumeInfo.description,
            image: data.volumeInfo.imageLinks
              ? data.volumeInfo.imageLinks.thumbnail
              : "",
            publicationDate: data.volumeInfo.publishedDate,
            pageCount: data.volumeInfo.pageCount,
            publisher: data.volumeInfo.publisher,
            categories: data.volumeInfo.categories,
            isbn: data.volumeInfo.industryIdentifiers[0].identifier,
            epub: null, // Set it to null initially
          };
          this.saveBook();
        } else {
          console.log("No se encontraron libros.");
        }
      } catch (error) {
        console.error("Error retrieving book data:", error);
      }
    },
    async saveBook() {
      try {
        const userId = localStorage.getItem("userId"); // Obtener el ID del usuario del localStorage
        const libroExists = await this.checkISBNExists(this.bookData.isbn);
        
        
    // Si el libro ya existe, le guarda la id del libro al usuario
        if (libroExists[0]) {
          const libro = libroExists[1];
          console.log("libro exists 1 id:");
          console.log(libro[0]._id);
          const libroId = libro[0]._id;
          const progresoLibrosData = {
            libro: libroId,
            capituloActual: "0", // Capítulo por defecto cuando no se ha leído ningún capítulo aún
          };

          console.log("ISBN already exists in the database.");
          await axios.post(
            `http://localhost:3000/usuarios/${userId}/libros`,
            progresoLibrosData
          );

          console.log("Libro guardado correctamente");
          router.go(); 
        }else{
          const formData = new FormData();
        formData.append("epub", this.file); // Append the rest of the book data to FormData
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
          console.log("FORM DATA: ")
          console.log(formData)
        const response = await axios.post(
          `http://localhost:3000/libros`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Establece el tipo de contenido correcto para FormData
            },
          }
        );

        const libroId = response.data._id; // Obtén el ID del libro guardado
        console.log(libroId);
        const progresoLibrosData = {
          libro: libroId,
          capituloActual: "0", // Capítulo por defecto cuando no se ha leído ningún capítulo aún
        };

        await axios.post(
          `http://localhost:3000/usuarios/${userId}/libros`,
          progresoLibrosData
        );

        console.log("Libro guardado correctamente:", response.data);
        router.go();
        }

        
      } catch (error) {
        console.error("Error al guardar el libro:", error);
      }
    },
    async checkISBNExists(isbn) {
      try {
        console.log("isbn: " + isbn);
        const response = await axios.get(
          `http://localhost:3000/libros?isbn=${isbn}`
        );

        if (response.data.length > 0) {
          // ISBN exists in the database
          return [true, response.data];
        } else {
          // ISBN does not exist in the database
          return [false];
        }
      } catch (error) {
        console.error("Error checking ISBN:", error);
        return false; // Assume ISBN does not exist in case of an error
      }
    },
  },
};
</script>
