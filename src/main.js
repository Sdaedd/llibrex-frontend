import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* Importación de los archivos CSS de bulma */
import 'bulma/css/bulma.css'

const app = createApp(App);

app.use(router).mount('#app');