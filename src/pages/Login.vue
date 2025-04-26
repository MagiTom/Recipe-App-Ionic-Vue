<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Logowanie</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-card class="login-card">
          <ion-card-header>
            <ion-card-title class="ion-text-center">Witaj ponownie!</ion-card-title>
          </ion-card-header>
          <ion-card-content class="login-content">
            <ion-item>
              <ion-label position="floating">E-mail</ion-label>
              <ion-input v-model="email" type="email" clear-input></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Hasło</ion-label>
              <ion-input v-model="password" type="password" clear-input></ion-input>
            </ion-item>

            <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="login">
              {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
            </ion-button>

            <ion-button expand="block" fill="outline" router-link="/register" class="ion-margin-top">
              Nie masz konta? Zarejestruj się
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // zmień ścieżkę, jeśli masz inaczej
import {
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
  IonLabel,
  IonInput,
  IonButton,
  useIonRouter,
} from '@ionic/vue';

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
    IonLabel,
    IonInput,
    IonButton,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useIonRouter();
    const email = ref('');
    const password = ref('');
    const loading = ref(false);

    const login = async () => {
      if (!email.value || !password.value) {
        alert('Podaj email i hasło!');
        return;
      }

      loading.value = true;
      try {
        await authStore.login(email.value, password.value);
        alert(`Zalogowano jako ${email.value}!`);
        router.push('/home')
      } catch (err: any) {
        alert('Błąd logowania: ' + (err.response?.data?.detail || err.message));
      } finally {
        loading.value = false;
      }
    };

    return { email, password, loading, login };
  },
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px); /* Odejmujemy wysokość toolbar */
}

.login-card {
  width: 100%;
  max-width: 400px;
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
