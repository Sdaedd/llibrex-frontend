<template>
    <div class="modal is-active">
      <div class="modal-background" @click="$emit('closePopup')"></div>
      <div class="modal-card has-text-white">
        <header class="modal-card-head has-background-black-ter">
          <p class="modal-card-title has-text-light">{{ book.title }}</p>
          <button class="delete" aria-label="close" @click="$emit('closePopup')"></button>
        </header>
        <section class="modal-card-body has-background-grey-dark">
          <div class="media">
            <div class="media-left">
              <figure class="image is-128x128">
                <img :src="book.image" alt="Book Cover">
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <div class="columns">
                  <div class="column">
                    <p><strong class="has-text-grey-light title is-5">Autor/es:</strong> {{ book.authors.join(', ') }}</p>
                    <p><strong class="has-text-grey-light title is-5">Editorial:</strong> {{ book.publisher }}</p>
                    <p><strong class="has-text-grey-light title is-5">Género:</strong> {{ book.categories.slice(0, 3).join(', ') }}</p>
                  </div>
                  <div class="column">
                    <p><strong class="has-text-grey-light title is-5">ISBN:</strong> {{ book.isbn }}</p>
                    <p><strong class="has-text-grey-light title is-5">Páginas:</strong> {{ book.pageCount === 0 ? 'Desconocido' : book.pageCount }}</p>
                    <p><strong class="has-text-grey-light title is-5">Valoración:</strong> {{ book.rating }}</p>
                  </div>
                </div>
                <p><strong class="has-text-grey-light title is-4">Progreso:</strong></p>
                <div class="level-item has-text-centered progress-container">
                  <progress class="progress show-value is-large is-dark" :value="book.capituloActual" max="100"></progress>
                  <p class="progress-value has-text-grey">{{book.capituloActual}}%</p>
                </div>
                <div class="description-wrapper">
                  <p><strong class="has-text-grey-light title is-3">Sinopsis:</strong></p>
                  <div v-if="showFullDescription">
                    <p>{{ book.description }}</p>
                    <button class="button is-small is-light is-outlined is-focused" @click="showFullDescription = false">Mostrar menos</button>
                  </div>
                  <div v-else-if="hasTruncatedDescription">
                    <p>{{ truncatedDescription }}</p>
                    <button v-if="this.book.description.length > 450" class="button is-light is-outlined" @click="showFullDescription = true">Mostrar más</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot has-background-black-ter">
          <!-- Footer content if needed -->
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      book: {
        type: Object,
        required: true
      },
      pagina: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        showFullDescription: false
      };
    },
    computed: {
      hasTruncatedDescription() {
        return this.book.description && this.book.description.length;
      },
      truncatedDescription() {
        if (this.hasTruncatedDescription && this.book.description.length > 450) {
          return this.book.description.slice(0, 650) + "...";
        }
        return this.book.description;
      },
    }
  };
  </script>
  
  <style scoped>
  /* Estilos generales */
  .modal {
    padding-bottom: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-background {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .modal-card {
    width: 80%;
    height: 80%;
    max-width: 1000px;
    max-height: 700px;
    overflow-y: auto;
    border-radius: 8px;
  }
  
  .modal-card-head {
    background-color: #f5f5f5;
  }
  
  .modal-card-title {
    flex-grow: 1;
    color: #363636;
  }
  
  .modal-card-body {
    padding-bottom: 5px !important;
    padding: 1.5rem;
    font-size: large;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }
  
  .modal-card-footer {
    background-color: #f5f5f5;
  }

  .modal-card-body .media-left .image {
    width: 142px; /* Ajusta el ancho de la imagen según tus necesidades */
    height: auto; /* Esto permite que la altura se ajuste automáticamente para mantener la proporción de la imagen */
}
  
  .content {
    padding-left: 15px;
  }
  
  .button {
    margin-top: 0.5rem;
  }
  
  .delete {
    opacity: 0.7;
  }
  
  .delete:hover {
    opacity: 1;
  }
  
  .progress {
    border: white solid 1px;
  }
  
  @media (max-width: 768px) {
    .modal-card {
      width: 95%;
      height: 95%;
    }
  }
  
  .progress-container {
    position: relative;
  }
  
  .progress-value {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: calc(1rem / 1.5);
    line-height: 1rem;
    font-weight: bold;
    text-shadow: 0px 0px 25px black;
  }
  
  .description-wrapper {
    margin-top: 1rem;
  }
  
  .progress.is-small+.progress-value {
    font-size: calc(0.75rem / 1.5);
    line-height: 0.75rem;
}

.progress.is-medium+.progress-value {
    font-size: calc(1.25rem / 1.5);
    line-height: 1.25rem;
}

.progress.is-large+.progress-value {
    font-size: calc(1.5rem / 1.5);
    line-height: 1.5rem;
}
  </style>
  