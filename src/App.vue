<template>
  <ion-app>
    <!-- Główna treść aplikacji -->
    <ion-router-outlet />

    <!-- Dolny pasek narzędzi -->
    <ion-footer v-if="showFooter">
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
import { computed, defineComponent, ref, watch } from 'vue'
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
import { useRoute } from 'vue-router'

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
    const route = useRoute();
    const categoryStore = useCategoryStore();
    const showFooter = computed(() => {
      console.log('route', route?.path)
      return !['/login', '/home'].includes(route?.path);
    });

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
      showFooter
    };
  },
});
</script>

<style scoped lang="scss">
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
