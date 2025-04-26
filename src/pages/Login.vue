<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="login-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome Back!</ion-card-title>
          </ion-card-header>
          <ion-card-content fullscreen class="login-content">
            <ion-item>
              <ion-label position="floating">Username</ion-label>
              <ion-input v-model="username" clear-input></ion-input>
            </ion-item>
            <ion-button expand="block" class="ion-margin-top" @click="login">
              Login
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
} from '@ionic/vue'
import { useMainStore } from '../store'

export default defineComponent({
  name: 'Login',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
  },
  setup() {
    const store = useMainStore()
    const username = ref('')

    const login = () => {
      if (username.value) {
        store.setUser({ id: '1', name: username.value })
        alert(`Welcome, ${username.value}!`)
      } else {
        alert('Please enter a username')
      }
    }

    return { username, login }
  },
})
</script>

<style scoped>
.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
}

.login-container {
  margin: auto;
  width: 100%;
  max-width: 400px;
}

ion-card {
  width: 100%;
  max-width: 400px;
}
</style>
