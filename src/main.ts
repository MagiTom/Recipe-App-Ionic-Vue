import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IonicVue } from '@ionic/vue'
import { createPinia } from 'pinia'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'
import { addIcons } from 'ionicons'
import { arrowBack } from 'ionicons/icons'
import { useAuthStore } from './stores/authStore'

/* Theme variables */
// import './theme/variables.css'

addIcons({
  'arrow-back': arrowBack,
});

const app = createApp(App)

const pinia = createPinia()

app.use(IonicVue)
app.use(router)
app.use(pinia)
const authStore = useAuthStore();
authStore.initializeAuth();

router.isReady().then(() => {
  app.mount('#app')
})
