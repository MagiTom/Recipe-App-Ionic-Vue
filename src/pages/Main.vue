<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar>
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
import { useMainStore } from '@/store'
import { useAuthStore } from '@/stores/authStore.ts'
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter
} from '@ionic/vue'
import { chevronBackOutline, library, logOutOutline } from 'ionicons/icons'

const mainStore = useMainStore()
const authStore = useAuthStore()
const router = useIonRouter()

const goBack = () => {
  if (router.canGoBack()) {
    router.back()
  } else {
    alert('Nie ma poprzedniej strony!')
  }
}

const logout = () => {
  authStore.logout()
  mainStore.clearUser()
  router.push('/login')
}
</script>
