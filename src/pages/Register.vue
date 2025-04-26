<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Rejestracja</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Zarejestruj się</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">E-mail</ion-label>
            <ion-input v-model="email" type="email" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Hasło</ion-label>
            <ion-input v-model="password" type="password" required></ion-input>
          </ion-item>
          <ion-button expand="block" @click="register">Zarejestruj się</ion-button>
          <ion-button expand="block" fill="outline" :router-link="'/login'">Wróć do logowania</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Register',
  setup() {
    const store = useStore();
    const email = ref('');
    const password = ref('');

    const register = async () => {
      try {
        await store.dispatch('auth/register', { email: email.value, password: password.value });
        alert('Rejestracja zakończona sukcesem!');
      } catch (err) {
        alert('Błąd rejestracji: ' + err.message);
      }
    };

    return { email, password, register };
  },
});
</script>
