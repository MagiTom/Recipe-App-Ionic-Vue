<template>
  <ion-page>
    <ion-tabs>

      <!-- Zawartość stron/tabów -->
      <ion-router-outlet></ion-router-outlet>

      <!-- Pasek kart -->
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="back" @click="goBack">
          <ion-icon :icon="chevronBackOutline" />
          <ion-label>wstecz</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="library" />
          <ion-label>Kategorie</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="back" @click="logout">
          <ion-icon :icon="logOutOutline" />
          <ion-label>Wyloguj</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonButton } from '@ionic/vue'
import { useIonRouter } from '@ionic/vue';
import { chevronBackOutline, library, logOutOutline } from 'ionicons/icons'
import { useMainStore } from '@/store'
import { useAuthStore } from '@/stores/authStore.ts'

const mainStore = useMainStore()
const authStore = useAuthStore()
const router = useIonRouter();

const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    alert('Nie ma poprzedniej strony!');
  }
};

const logout = () => {
  authStore.logout()
  mainStore.clearUser()
  router.push('/login')
}

</script>
