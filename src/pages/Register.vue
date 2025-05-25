<template>
  <ion-page>
    <ion-content class="ion-padding login">
      <div class="register-container">
      <ion-card class="register-card">
        <ion-card-header>
          <ion-text color="primary">
            <h1 class="ion-text-center">Zarejestruj się!</h1>
          </ion-text>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-input label-placement="floating" label="Nazwa użytkownika" v-model="username" type="text" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label-placement="floating" label="E-mail" v-model="email" type="email" required :clear-input="true"></ion-input>
          </ion-item>

          <ion-item>
            <ion-input label-placement="floating" label="Hasło" v-model="password" type="password" :clear-input="true" required></ion-input>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="register">
            {{ loading ? 'Rejestruję...' : 'Zarejestruj się' }}
          </ion-button>

          <ion-button expand="block" fill="outline" router-link="/login" class="ion-margin-top">
            Wróć do logowania
          </ion-button>
        </ion-card-content>
      </ion-card>
      </div>
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
import { useToast } from '@/composables/useToast.ts'

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
    const { presentToast } = useToast();

    const register = async () => {
      if (!username.value || !email.value || !password.value) {
        await presentToast('Wprowadź nazwę użytkownika, email i hasło!', 'warning');
        return;
      }

      loading.value = true;
      try {
        await authStore.register(username.value, email.value, password.value);
        await presentToast('Rejestracja zakończona sukcesem!', 'success');
      } catch (err: any) {
        await presentToast('Błąd rejestracji: ' + (err.response?.data?.details?.detail), 'danger');
      } finally {
        loading.value = false;
      }
    };

    return { username, email, password, register, loading };
  },
});
</script>

<style scoped>
ion-content.login {
  --background: var(--ion-color-primary) url('@/assets/background.png') no-repeat center center / cover;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px);
}
.register-card {
  width: 100%;
  max-width: 400px;
}

ion-card-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

ion-item {
  margin-bottom: 16px;
}
</style>
