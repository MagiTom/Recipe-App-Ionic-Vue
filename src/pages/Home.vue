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
        <ion-item button @click="goToCategory(null)">
          <ion-thumbnail slot="start">
            <img
              alt="Silhouette of mountains"
              src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
            />
          </ion-thumbnail>
          <ion-label>Wszystkie przepisy</ion-label>
        </ion-item>
        <ion-item
          @click="goToCategory(category.id)"
          v-for="category in categoryStore.categories"
          :key="category.id"
          button
        >
          <ion-thumbnail slot="start">
            <img
              alt="Category image"
              :src="category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
            />
          </ion-thumbnail>
          <ion-label>{{ category.name }}</ion-label>
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
          <!-- Add New Category -->
          <ion-item>
            <ion-label position="floating">Nowa kategoria</ion-label>
            <ion-input v-model="newCategoryName" clear-input></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Dodaj obrazek</ion-label>
            <input type="file" accept="image/*" @change="handleImageUpload($event, 'new')" />
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            :disabled="loading"
            @click="addCategory"
          >
            {{ loading ? 'Dodawanie...' : 'Dodaj kategorię' }}
          </ion-button>

          <!-- List Categories -->
          <ion-list class="ion-margin-top">
            <ion-item v-for="category in categoryStore.categories" :key="category.id">
              <ion-thumbnail slot="start">
                <img
                  alt="Category image"
                  :src="category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
                />
              </ion-thumbnail>
              <span style="flex-grow: 1">{{ category.name }}</span>
              <ion-button size="small" @click="editCategory(category)"> Edytuj </ion-button>
              <ion-button color="danger" size="small" @click.stop="deleteCategory(category.id)">
                Usuń
              </ion-button>
            </ion-item>
          </ion-list>

          <!-- Edit Category Modal -->
          <ion-modal :is-open="editModalVisible" @didDismiss="closeEditModal">
            <ion-header>
              <ion-toolbar>
                <ion-title>Edytuj kategorię</ion-title>
                <ion-buttons slot="end">
                  <ion-button @click="closeEditModal">Zamknij</ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>

            <ion-content class="ion-padding">
              <ion-item>
                <ion-label position="floating">Nazwa kategorii</ion-label>
                <ion-input v-model="editCategoryData.name" clear-input></ion-input>
              </ion-item>

              <ion-item>
                <ion-label>Podgląd obrazka</ion-label>
                <ion-thumbnail slot="end" v-if="editCategoryImagePreview || editCategoryData.image">
                  <img
                    :src="editCategoryImagePreview || editCategoryData.image"
                    alt="Category image"
                  />
                </ion-thumbnail>
              </ion-item>

              <ion-item>
                <ion-label>Zmień obrazek</ion-label>
                <input type="file" accept="image/*" @change="handleImageUpload($event, 'edit')" />
              </ion-item>

              <ion-button
                v-if="editCategoryData.image"
                color="danger"
                expand="block"
                class="ion-margin-top"
                @click="removeImage"
              >
                Usuń obrazek
              </ion-button>

              <ion-button expand="block" class="ion-margin-top" @click="updateCategory">
                Zapisz zmiany
              </ion-button>
            </ion-content>
          </ion-modal>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeUnmount, onMounted, type Ref, ref } from 'vue'
import {
  IonModal,
  IonThumbnail,
  onIonViewDidLeave,
  onIonViewWillEnter,
  onIonViewWillLeave,
  useIonRouter
} from '@ionic/vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/vue'
import { useMainStore } from '../store'
import { useCategoryStore } from '../stores/categoryStore'
import { useAuthStore } from '@/stores/authStore.ts'
import { useUiStore } from '@/stores/uiStore.ts'

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
    IonModal,
    IonButtons,
    IonThumbnail,
  },
  setup() {
    const mainStore = useMainStore()
    const authStore = useAuthStore()
    const categoryStore = useCategoryStore()
    const router = useIonRouter()
    const newCategoryName = ref('')
    const newCategoryImage = ref<File | null>(null)
    const loading = ref(false)
    const showModal = ref(false)
    const editModalVisible = ref(false)
    const editCategoryData = ref({ id: null, name: '', image: null })
    const editCategoryImagePreview = ref<string | null>(null)

    onMounted(() => {
      categoryStore.fetchCategories()
    });

    const logout = () => {
      authStore.logout();
      mainStore.clearUser();
      router.push('/login');
    };

    const goToCategory = (categoryId: number | null) => {
      router.push(`/category/${categoryId}`)
    }

    const handleImageUpload = (event: Event, type: 'new' | 'edit') => {
      const file = (event.target as HTMLInputElement).files?.[0] || null

      if (type === 'new') {
        newCategoryImage.value = file
      } else {
        // Store the file object for uploading
        editCategoryData.value.image = file

        // Generate a preview URL for the selected file
        if (file) {
          if (editCategoryImagePreview.value) {
            URL.revokeObjectURL(editCategoryImagePreview.value) // Revoke the old preview URL
          }
          editCategoryImagePreview.value = URL.createObjectURL(file)
        } else {
          // Clear the preview if no file is selected
          editCategoryImagePreview.value = null
        }
      }
    }

    const removeImage = () => {
      // Revoke the preview URL to avoid memory leaks
      if (editCategoryImagePreview.value) {
        URL.revokeObjectURL(editCategoryImagePreview.value)
      }

      editCategoryImagePreview.value = null // Clear the preview
      editCategoryData.value.image = null // Clear the file object
    }

    const addCategory = async () => {
      if (!newCategoryName.value.trim()) {
        alert('Podaj nazwę kategorii!')
        return
      }
      loading.value = true
      try {
        await categoryStore.addCategory(newCategoryName.value.trim(), newCategoryImage.value)
        await categoryStore.fetchCategories()
        alert('Kategoria została dodana!')
        newCategoryName.value = ''
        newCategoryImage.value = null
      } catch (err: any) {
        alert('Błąd dodawania kategorii: ' + (err.response?.data?.detail || err.message))
      } finally {
        loading.value = false
      }
    }

    const editCategory = (category: any) => {
      editCategoryData.value = { ...category }
      editModalVisible.value = true
    }

    const updateCategory = async () => {
      if (!editCategoryData.value.name.trim()) {
        alert('Podaj nazwę kategorii!')
        return
      }
      try {
        await categoryStore.updateCategory(editCategoryData.value.id, {
          name: editCategoryData.value.name,
          image: editCategoryData.value.image,
        })
        await categoryStore.fetchCategories()
        alert('Kategoria została zaktualizowana!')
        closeEditModal()
      } catch (err: any) {
        alert('Błąd aktualizacji kategorii: ' + (err.response?.data?.detail || err.message))
      }
    }

    const closeEditModal = () => {
      editModalVisible.value = false
      editCategoryData.value = { id: null, name: '', image: null }
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

    return {
      mainStore,
      categoryStore,
      newCategoryName,
      newCategoryImage,
      loading,
      showModal,
      editModalVisible,
      editCategoryData,
      logout,
      addCategory,
      editCategory,
      updateCategory,
      deleteCategory,
      closeEditModal,
      handleImageUpload,
      removeImage,
      goToCategory,
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

ion-thumbnail img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}
</style>
