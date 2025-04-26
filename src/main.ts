import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Theme variables */
// import './theme/variables.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Dodaj IonicVue
app.use(IonicVue);

// Dodaj router
app.use(router);

console.log('Router:', router);
console.log('App initialized');

// Upewnij się, że router jest gotowy przed zamontowaniem aplikacji
router.isReady().then(() => {
  app.mount('#app');
});
