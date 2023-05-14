import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser)

/* Importación de los archivos CSS de bulma */
import 'bulma/css/bulma.css'

const app = createApp(App);

app.use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app');