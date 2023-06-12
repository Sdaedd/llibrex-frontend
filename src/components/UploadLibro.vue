<template>
  <div>
    <form @submit.prevent="parseFiles">
      <div class="file has-name is-boxed">
        <label class="file-label">
          <input class="file-input is-black" type="file" name="files" multiple @change="handleFileUpload" />
          <span class="file-cta has-background-dark">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label has-text-white"> Elige un archivo... </span>
          </span>
          <span class="file-name has-text-white">
            {{ files.length > 0 ? `${files.length} archivos seleccionados` : "No hay archivos seleccionados" }}
          </span>
        </label>
      </div>
      <button v-if="!bookData" class="button is-black mt-3" type="submit" :disabled="files.length === 0">
        Subir EPUB(s)
      </button>
      <div>
        <p v-if="errorMessage" class="help is-danger">{{ errorMessage }}</p>
        <p v-if="successMessage" class="help is-success">{{ successMessage }}</p>
      </div>
    </form>
    <div v-if="isUploading" class="notification is-primary has-text-centered has-background-grey-dark">
      <progress class="progress is-small is-primary" max="100" :value="uploadProgress"></progress>
      <p>Subiendo archivos... {{ uploadProgress.toFixed(0) }}%</p>
    </div>
  </div>
</template>


<script>
import ePub from "epubjs";
import axios from "axios";
import router from "@/router";

export default {
  data() {
    return {
      files: [],
      bookData: null,
      allowedExtensions: [".epub", ".pdf"], // Extensiones de archivo permitidas
      errorMessage: null, // Mensaje de error en caso de archivo no válido
      successMessage: null, // Mensaje de éxito en caso de subida exitosa
      isUploading: false, // Indica si se están subiendo los archivos
      uploadProgress: 0, // Progreso de carga en porcentaje
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  methods: {
    handleFileUpload(event) {
      const selectedFiles = Array.from(event.target.files);

      // Filtrar los archivos seleccionados por extensión válida
      this.files = selectedFiles.filter(file => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return this.allowedExtensions.includes(`.${fileExtension}`);
      });

      if (this.files.length !== selectedFiles.length) {
        this.errorMessage = "Algunos archivos no son válidos. Por favor, selecciona solo archivos EPUB o PDF.";
      } else {
        this.errorMessage = null; // Limpiar mensaje de error si todos los archivos son válidos
      }
    },
    async parseFiles() {
      if (this.files.length > 0) {
        this.isUploading = true; // Iniciar la carga de archivos
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i];
          if (file.name.endsWith(".epub")) {
            await this.parseEPUB(file);
          } else if (file.name.endsWith(".pdf")) {
            await this.parsePDF(file);
          }
          this.uploadProgress = ((i + 1) / this.files.length) * 100; // Actualizar el progreso de carga
        }
      }
    },
    async parseEPUB(file) {
      try {
        const book = ePub(file);
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error("Tiempo de espera agotado")), 5000); // Establece un tiempo de espera de 5 segundos
        });
        await Promise.race([book.ready, timeout]); // Espera a que se complete la carga del libro o se cumpla el tiempo de espera

        const metadata = book.package.metadata;
        let searchId = metadata.identifier.replace("urn:", "");
        if (!searchId.includes("isbn")) {
          searchId = metadata.title;
        }
        await this.searchOnGoogleBooks(searchId, file);
      } catch (error) {
        this.files = []
        this.isUploading = false,
          this.uploadProgress = 0,
          this.errorMessage = "Error al parsear el archivo EPUB";
      }
    },

    async parsePDF(file) {
      try {
        this.bookData = {
          title: file.name,
          authors: [],
          description: "",
          image: "",
          publicationDate: "",
          pageCount: 0,
          publisher: "",
          categories: [],
          isbn: "",
          pdf: file, // Set it to the selected PDF file
        };
        this.saveBook();
      } catch (error) {
        console.error("Error al parsear el archivo PDF:", error);
      }
    },
    async searchOnGoogleBooks(searchId, file) {
      try {
        const apiKey = "AIzaSyAeN5D4nw0cPLBVXnBrS7umspy2tHytSjg";
        const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchId}&key=${apiKey}`;
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
            epub: file,
          };
          this.saveBook();
        } else {
          this.errorMessage = "No se encontraron libros.";
        }
      } catch (error) {
        this.errorMessage = "Error recuperando la información del libro";
      }
    },
    async saveBook() {
      try {
        const userId = localStorage.getItem("userId"); // Obtener el ID del usuario del localStorage
        const libroExists = await this.checkISBNExists(this.bookData.isbn);

        // Si el libro ya existe y el usuario ya lo tiene, no hacer nada
        if (libroExists[0]) {
          const libro = libroExists[1];
          const libroId = libro[0]._id;
          if (this.user.progresoLibros.some(item => item.libro === libroId)) {
            this.errorMessage = `El libro "${this.bookData.title}" ya está en tu biblioteca.`;
            await this.sleep(5000);
            this.finishUpload()
            return; // Salir de la función sin hacer nada más
          }
        }

        // Si el libro ya existe, le guarda la ID del libro al usuario
        if (libroExists[0]) {
          const libro = libroExists[1];
          const libroId = libro[0]._id;
          const progresoLibrosData = {
            libro: libroId,
            capituloActual: "0", // Capítulo por defecto cuando no se ha leído ningún capítulo aún
          };

          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/usuarios/${userId}/libros`,
            progresoLibrosData
          );
          this.successMessage = "Libro guardado correctamente";
          await this.sleep(2000);
          this.finishUpload();
        } else {
          // El libro no existe, guardarlo y asignarlo al usuario
          const formData = new FormData();
          formData.append("epub", this.bookData.epub); // Append the EPUB file to FormData
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

          const response = await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/libros`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Establece el tipo de contenido correcto para FormData
              },
            }
          );

          const libroId = response.data._id; // Obtén el ID del libro guardado
          const progresoLibrosData = {
            libro: libroId,
            capituloActual: "0", // Capítulo por defecto cuando no se ha leído ningún capítulo aún
          };

          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/usuarios/${userId}/libros`,
            progresoLibrosData
          );
          this.successMessage = "Libro guardado correctamente";
          await this.sleep(2000);
          this.finishUpload();
        }
      } catch (error) {
        this.errorMessage = "Error al guardar el libro:";
      }
    },
    async checkISBNExists(isbn) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/libros?isbn=${isbn}`
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
        return [false]; // Assume ISBN does not exist in case of an error
      }
    },
    finishUpload() {
      if (this.uploadProgress === 100) {
        this.isUploading = false; // Finalizar la carga de archivos
        this.uploadProgress = 0; // Reiniciar el progreso de carga
        this.bookData = null
        this.files = [];
        router.go(); // Redirigir después de cargar todos los archivos
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
};
</script>

<style scoped>
.file-input {
  display: none;
}

.file-cta {
  border: 2px solid #dbdbdb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.file-cta:hover {
  background-color: #dbdbdb;
}

.file-cta.has-background-dark {
  background-color: #363636;
  color: #fff;
}

.file-cta.has-background-dark:hover {
  background-color: #252525;
}

form {
  max-width: 250px;
}
</style>