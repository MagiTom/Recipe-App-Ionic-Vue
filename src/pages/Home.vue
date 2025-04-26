<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Wybierz kategorię</ion-title>
        <ion-button @click="logout" slot="end">Wyloguj</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item
          v-for="category in categories"
          :key="category.id"
          button
          @click="goToCategory(category.id)"
        >
          {{ category.displayName }}
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useIonRouter } from '@ionic/vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem } from '@ionic/vue';
import { useMainStore } from '../store';

export default defineComponent({
  name: 'Home',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
  },
  setup() {
    const store = useMainStore();
    const router = useIonRouter();

    const categories = [
      { id: 'breakfast', displayName: 'Śniadania' },
      { id: 'lunch', displayName: 'Obiady' },
      { id: 'dinner', displayName: 'Kolacje' },
      { id: 'desserts', displayName: 'Desery' },
      { id: 'snacks', displayName: 'Przekąski' },
    ];

    const logout = () => {
      store.clearUser();
      alert('Zostałeś wylogowany!');
    };

    const goToCategory = (categoryId: string) => {
      router.push(`/category/${categoryId}`);
    };

    return { logout, categories, goToCategory };
  },
});
</script>

<style scoped>
ion-item {
  --padding-start: 20px;
  --inner-padding-end: 20px;
  font-size: 1.1rem;
}
</style>
