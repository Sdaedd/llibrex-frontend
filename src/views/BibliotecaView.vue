<template>
    <NavBar />
    <div v-if="libros.length > 0" class="container" style="padding: 15px;">
        <!-- Últimos libros leídos -->
        <p class="title is-3 has-text-light">Biblioteca</p>
        <hr />
        <SliderCard :libros="libros" @bookSelected="showBookPopup" />
        <hr />
        <br />
        <div v-if="librosLeidosRecientemente.length != 0">
            <p class="title is-4 has-text-light">Últimos libros leídos</p>
            <SliderCard :libros="librosLeidosRecientemente" @bookSelected="showBookPopup" />
        </div>

        <!-- Loop through unique genres -->
        <div v-for="genre in uniqueGenres" :key="genre">
            <hr />
            <p class="title is-4 has-text-light">{{ genre }}</p>
            <SliderCard :libros="getLibrosByGenre(genre)" @bookSelected="showBookPopup" />
        </div>
        <BookPopup :pagina="capituloActual" :book="selectedBook" v-if="selectedBook" @closePopup="selectedBook = null"
            @libroBorrado="handleLibroBorrado" />
    </div>
    <div v-if="libros.length == 0" class="container" style="text-align: center">
        <br />
        <div class="notification is-warning is-light">
          No hay libros que mostrar
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import SliderCard from '@/components/SliderCard.vue';
import BookPopup from '@/components/BookPopup.vue';
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'HomeView',
    components: {
        SliderCard,
        BookPopup,
        NavBar,
    },
    data() {
        return {
            isLoaded: false,
            selectedBook: null,
            capituloActual: null,
            showEpubReader: false,
            libros: [],
        };
    },
    computed: {
        ...mapState(['currentLocation']),
        uniqueGenres() {
            // Get unique genres from libros
            const genres = new Set();
            this.libros.forEach((libro) => {
                libro.categories.forEach((category) => {
                    genres.add(category);
                });
            });
            return Array.from(genres).sort();
        },
        librosLeidosRecientemente() {
            return this.libros.filter(libro => libro.fechaUltimaLectura)
                .sort((a, b) => new Date(b.fechaUltimaLectura) - new Date(a.fechaUltimaLectura));
        },

    },
    mounted() {
        const currentLocation = localStorage.getItem('currentLocation');
        const currentBookId = localStorage.getItem('currentBookId');
        const currentBookProgress = localStorage.getItem('currentProgress');

        if (currentLocation != null || currentBookId != null) {
            this.saveCurrentLocation(currentLocation, currentBookId, currentBookProgress);
        }

        this.getLibros();
    },
    methods: {
        showBookPopup(book, pagina) {
            this.selectedBook = book;
            this.capituloActual = parseInt(pagina);
        },
        handleLibroBorrado() {
            this.getLibros(); // Vuelve a obtener la lista de libros para refrescarla
        },

        // Guardar progreso del libro en la BBDD
        saveCurrentLocation(currentLocation, currentBookId, currentBookProgress) {
            const userId = localStorage.getItem('userId');
            const libroId = currentBookId;

            const url = `http://localhost:3000/usuarios/${userId}/libros/${libroId}`;
            const data = {
                capituloActual: currentBookProgress,
                epubCfi: currentLocation,
            };

            axios
                .put(url, data)
                .then(() => {
                    // La solicitud fue exitosa
                    localStorage.removeItem('currentProgress');
                    localStorage.removeItem('currentBookId');
                    localStorage.removeItem('currentLocation');
                    this.getLibros();
                })
                .catch((error) => {
                    // Se produjo un error al realizar la solicitud
                    console.error(error);
                });
        },
        getLibros() {
            const userId = localStorage.getItem('userId');

            axios
                .get(`http://localhost:3000/usuarios/${userId}/libros`)
                .then((response) => {
                    const progresoLibros = response.data;
                    const libroIds = progresoLibros.map((libro) => libro.libro);

                    axios
                        .get('http://localhost:3000/libros')
                        .then((response) => {
                            this.libros = response.data
                                .filter((libro) => libroIds.includes(libro._id))
                                .map((libro) => ({
                                    ...libro,
                                    showAll: false,
                                    capituloActual: progresoLibros.find((progreso) => progreso.libro === libro._id)?.capituloActual || 0,
                                    fechaUltimaLectura: progresoLibros.find((progreso) => progreso.libro === libro._id)?.fechaUltimaLectura || '',
                                }));

                            this.libros.sort((a, b) => new Date(b.fechaUltimaLectura) - new Date(a.fechaUltimaLectura));

                            this.isLoaded = true;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        getLibrosByGenre(genre) {
            return this.libros.filter((libro) => libro.categories.includes(genre));
        },
    },
    beforeRouteUpdate(to, from, next) {
        this.getLibros();
        next();
    },
    unmounted() {
        window.removeEventListener('resize', this.handleResize);
    },
};
</script>

<style>
.carousel__prev,
.carousel__next {
    border-radius: 20px;
    border: 2px solid black;
}

.carousel__prev--disabled,
.carousel__next--disabled {
    border: none !important;
}

.carousel__prev:hover,
.carousel__next:hover {
    border: 2px solid gray;
}

.carousel__prev::before,
.carousel__next::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    background-image: radial-gradient(rgba(255, 255, 255, 0.589), transparent);
    filter: blur(2px);
}

.carousel__prev::before {
    z-index: -1;
}

.carousel__next::before {
    z-index: -2;
}

.carousel__pagination {
    color: white;
}
</style>
