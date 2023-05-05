<template>
  <div class="box" style="margin: 100px">
    <div class="card">
      <div class="columns">
        <div class="column" v-for="libro in libros" :key="libro.id">
          <div class="card-image">
            <figure class="image is-4by3">
              <img :src="libro.imagen" alt="Imagen de {{libro.titulo}}">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">{{libro.titulo}}</p>
                <p class="subtitle is-6">{{libro.autor}}</p>
              </div>
            </div>
            <div class="content">
              {{libro.descripcion}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      libros: [],
    };
  },
  mounted() {
    this.obtenerIdsLibros();
  },
  methods: {
    obtenerIdsLibros() {
      axios.get("tu-backend.com/libros").then((response) => {
        const idsLibros = response.data.map((libro) => libro.id);
        this.buscarLibros(idsLibros);
      });
    },
    buscarLibros(ids) {
      const libros = [];
      ids.forEach((id) => {
        axios
          .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
          .then((response) => {
            const libro = response.data.volumeInfo;
            libros.push({
              id: response.data.id,
              titulo: libro.title,
              autor: libro.authors.join(", "),
              descripcion: libro.description,
              imagen: libro.imageLinks.thumbnail,
            });
            this.libros = libros;
          });
      });
    },
  },
};
</script>
