<template>
  <ion-app>
    <!-- Główna treść aplikacji -->
    <ion-router-outlet inert/>

    <!-- Dolny pasek narzędzi -->
    <ion-footer>
      <ion-toolbar>
        <!-- Przycisk Wstecz -->
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon name="arrow-back"></ion-icon>
            Wstecz
          </ion-button>
          <ion-button @click="selectCategory()">
            kategorie
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  IonApp,
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonRouterOutlet,
} from '@ionic/vue';
import { useIonRouter } from '@ionic/vue';
import { useCategoryStore } from '@/stores/categoryStore';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonFooter,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonRouterOutlet,
  },
  setup() {
    const router = useIonRouter();
    const categoryStore = useCategoryStore();

    const categories = ref([
      { id: null, name: 'Wszystkie' }, // Domyślna kategoria "Wszystkie"
      ...categoryStore.categories,
    ]);
    const selectedCategory = ref(null); // Aktualnie wybrana kategoria

    const goBack = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        alert('Nie ma poprzedniej strony!');
      }
    };

    const selectCategory = () => {
      router.push(`/home`);
    };

    return {
      categories,
      selectedCategory,
      goBack,
      selectCategory,
    };
  },
});
</script>

<style scoped>
/* Stylizacja dolnego paska narzędzi */
ion-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  background: var(--ion-background-color);
  border-top: 1px solid var(--ion-border-color);
}

/* Przycisk Wstecz */
ion-buttons ion-button {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

ion-icon {
  margin-right: 0.5rem;
}

/* Pasek kategorii */
ion-segment {
  width: 100%;
  overflow-x: auto;
}

ion-segment-button {
  white-space: nowrap;
}
</style>
