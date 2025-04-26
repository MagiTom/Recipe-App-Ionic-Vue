<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Rejestracja</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="register-card">
        <ion-card-header>
          <ion-card-title class="ion-text-center">Zarejestruj się</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Nazwa użytkownika</ion-label>
            <ion-input v-model="username" type="text" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">E-mail</ion-label>
            <ion-input v-model="email" type="email" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Hasło</ion-label>
            <ion-input v-model="password" type="password" required></ion-input>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="register">
            {{ loading ? 'Rejestruję...' : 'Zarejestruj się' }}
          </ion-button>

          <ion-button expand="block" fill="outline" router-link="/login" class="ion-margin-top">
            Wróć do logowania
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Ścieżkę dostosuj do siebie
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
} from '@ionic/vue';

export default defineComponent({
  name: 'Register',
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
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);

    const register = async () => {
      if (!username.value || !email.value || !password.value) {
        alert('Wprowadź nazwę użytkownika, email i hasło!');
        return;
      }

      loading.value = true;
      try {
        await authStore.register(username.value, email.value, password.value);
        alert('Rejestracja zakończona sukcesem!');
      } catch (err: any) {
        alert('Błąd rejestracji: ' + (err.response?.data?.detail || err.message));
      } finally {
        loading.value = false;
      }
    };

    return { username, email, password, register, loading };
  },
});
</script>

<style scoped>
.register-card {
  max-width: 400px;
  margin: 40px auto;
  padding: 16px;
}

ion-card-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

ion-item {
  margin-bottom: 16px;
}
</style>
