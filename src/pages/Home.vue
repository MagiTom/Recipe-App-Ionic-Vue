<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Wybierz kategorię</ion-title>
        <ion-button @click="logout" slot="end">Wyloguj</ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button expand="block" @click="showModal = true">Zarządzaj kategoriami</ion-button>

      <ion-list>
        <ion-item v-for="category in categoryStore.categories" :key="category.id" button>
          <span @click="goToCategory(category.id)" style="flex-grow: 1">{{ category.name }}</span>
        </ion-item>
      </ion-list>

      <!-- MODAL -->
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Zarządzaj kategoriami</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showModal = false">Zamknij</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating">Nowa kategoria</ion-label>
            <ion-input v-model="newCategoryName" clear-input></ion-input>
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" :disabled="loading" @click="addCategory">
            {{ loading ? 'Dodawanie...' : 'Dodaj kategorię' }}
          </ion-button>

          <ion-list class="ion-margin-top">
            <ion-item v-for="category in categoryStore.categories" :key="category.id">
              <span style="flex-grow: 1">{{ category.name }}</span>
              <ion-button color="danger" size="small" @click.stop="deleteCategory(category.id)">
                Usuń
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useIonRouter } from '@ionic/vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/vue'
import { useMainStore } from '../store'
import { useCategoryStore } from '../stores/categoryStore' // upewnij się, że ścieżka do store się zgadza!

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
    IonLabel,
    IonInput,
  },
  setup() {
    const mainStore = useMainStore()
    const categoryStore = useCategoryStore()
    const router = useIonRouter()

    const newCategoryName = ref('')
    const loading = ref(false)
    const showModal = ref(false)

    const logout = () => {
      mainStore.clearUser()
      alert('Zostałeś wylogowany!')
      router.push('/login')
    }

    const goToCategory = (categoryId: number) => {
      router.push(`/category/${categoryId}`)
    }

    const addCategory = async () => {
      if (!newCategoryName.value.trim()) {
        alert('Podaj nazwę kategorii!')
        return
      }
      loading.value = true
      try {
        await categoryStore.addCategory(newCategoryName.value.trim())
        await categoryStore.fetchCategories() // odświeżenie listy po dodaniu
        alert('Kategoria została dodana!')
        newCategoryName.value = '' // wyczyszczenie pola
      } catch (err: any) {
        alert('Błąd dodawania kategorii: ' + (err.response?.data?.detail || err.message))
      } finally {
        loading.value = false
      }
    }

    const deleteCategory = async (categoryId: number) => {
      if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return
      try {
        await categoryStore.deleteCategory(categoryId)
        alert('Kategoria została usunięta!')
      } catch (err: any) {
        alert('Błąd usuwania kategorii: ' + (err.response?.data?.detail || err.message))
      }
    }

    onMounted(() => {
      categoryStore.fetchCategories()
    })

    return {
      mainStore,
      categoryStore,
      newCategoryName,
      loading,
      showModal,
      logout,
      addCategory,
      goToCategory,
      deleteCategory
    }
  },
})
</script>

<style scoped>

ion-item {
  --padding-start: 20px;
  --inner-padding-end: 20px;
  font-size: 1.1rem;
}

ion-modal {
  --height: 90%;
}

.add-category {
  margin-bottom: 24px;
}
</style>
