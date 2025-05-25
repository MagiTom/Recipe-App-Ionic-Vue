<template>
  <ion-page>
    <ion-content class="ion-padding login">
      <div class="login-container">
        <ion-card class="login-card">
          <div class="card-image"></div>
          <ion-card-header>
            <ion-text color="primary">
              <h1 class="ion-text-center">Zaloguj się!</h1>
            </ion-text>
          </ion-card-header>
          <ion-card-content class="login-content">
            <ion-item>
              <ion-input label-placement="floating" label="E-mail" v-model="email" type="email" :clear-input="true"></ion-input>
            </ion-item>

            <ion-item>
              <ion-input label-placement="floating" label="Hasło" v-model="password" type="password" :clear-input="true">
                <ion-input-password-toggle slot="end"></ion-input-password-toggle>
              </ion-input>
            </ion-item>

            <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="login">
              {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              router-link="/register"
              class="ion-margin-top"
            >
              Nie masz konta? Zarejestruj się
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore' // zmień ścieżkę, jeśli masz inaczej
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/vue'
import { useToast } from '@/composables/useToast.ts'

export default defineComponent({
  name: 'Login',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
  },
  setup() {
    const authStore = useAuthStore()
    const router = useIonRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const { presentToast } = useToast();

    const login = async () => {
      if (!email.value || !password.value) {
        await presentToast('Podaj email i hasło!', 'warning');
        return
      }

      loading.value = true
      try {
        await authStore.login(email.value, password.value)
        router.push('/home')
        await presentToast(`Zalogowano jako ${email.value}!`, 'success');
      } catch (err: any) {
        await presentToast('Błąd logowania: ' + (err.response?.data?.details?.detail), 'danger');
      } finally {
        loading.value = false
      }
    }

    return { email, password, loading, login }
  },
})
</script>

<style scoped>

ion-content.login {
  --background: var(--ion-color-primary) url('@/assets/background.png') no-repeat center center / cover;
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-image {
  background-image: url('../../public/spagetti.png');
  background-size: cover;
  background-position: top;
  height: 200px;
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.login-content {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

ion-item {
  margin-bottom: 16px;
}
</style>
