<template>
  <ion-page>
    <ion-content class="ion-padding">
      <p class="greeting">
        <ion-text color="primary">
          <ion-icon size="large" :icon="sunnyOutline"></ion-icon>
        </ion-text>
        Dzień Dobry
      </p>
      <p class="user">{{ authStore.user?.username || 'Użytkownik' }}</p>

      <p class="category">Wybierz kategorię</p>

      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card button @click="goToCategory(null)">
              <ion-card-header>
                <div class="card-header">
                  <ion-thumbnail>
                    <img
                      alt="Silhouette of mountains"
                      src="https://ionicframework.com/docs/img/demos/thumbnail.svg"
                    />
                  </ion-thumbnail>
                  <h2>Wszystkie przepisy</h2>
                </div>
              </ion-card-header>
            </ion-card>
          </ion-col>

          <ion-col
            size="12"
            size-md="6"
            v-for="category in categoryStore.categories"
            :key="category.id"
          >
            <ion-card button @click="goToCategory(category.id)">
              <ion-card-header>
                <div class="card-header">
                  <ion-thumbnail>
                    <img
                      alt="Category image"
                      :src="
                        category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'
                      "
                    />
                  </ion-thumbnail>
                  <h2>{{ category.name }}</h2>
                </div>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

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
            <ion-input
              label-placement="floating"
              label="Nowa kategoria"
              v-model="newCategoryName"
              clear-input
            ></ion-input>
          </ion-item>

          <ion-item lines="none">
            <ImagePicker @update:image="newCategoryImage = $event" />
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
            <ion-item-divider>
              <ion-label>Lista</ion-label>
            </ion-item-divider>

            <ion-item
              class="ion-margin-top"
              v-for="category in categoryStore.categories"
              :key="category.id"
            >
              <ion-thumbnail>
                <img
                  alt="Category image"
                  :src="category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
                />
              </ion-thumbnail>
              <span class="ion-margin-start" style="flex-grow: 1">{{ category.name }}</span>
              <ion-button strong fill="clear" size="small" @click="editCategory(category)">
                Edytuj
              </ion-button>
              <ion-button
                strong
                fill="clear"
                color="danger"
                size="small"
                @click.stop="deleteCategory(category)"
              >
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
                <ion-input
                  label-placement="floating"
                  label="Nazwa kategorii"
                  v-model="editCategoryData.name"
                  clear-input
                ></ion-input>
              </ion-item>

              <ion-item lines="none">
                <ImagePicker
                  :initialImage="
                    typeof editCategoryData.image === 'string' ? editCategoryData.image : null
                  "
                  @update:image="editCategoryData.image = $event"
                />
              </ion-item>

              <ion-button expand="block" class="ion-margin-top" @click="updateCategory">
                Zapisz zmiany
              </ion-button>
            </ion-content>
          </ion-modal>
        </ion-content>
      </ion-modal>

      <ion-fab>
        <ion-fab-button @click="showModal = true" class="add-button" shape="round" v-if="!loading">
          <ion-icon :icon="createOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useToast } from '@/composables/useToast'
import ImagePicker from './../components/ImagePicker.vue'
import { useAuthStore } from '@/stores/authStore'
import {
  alertController,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue'
import { sunnyOutline, createOutline } from 'ionicons/icons'
import { defineComponent, ref } from 'vue'
import { useCategoryStore, type Category } from '../stores/categoryStore'

interface EditableCategory {
  id: number | null
  name: string
  image: File | null | string
}

export default defineComponent({
  name: 'Home',
  components: {
    IonCol,
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
    IonIcon,
    IonFabButton,
    IonFab,
    ImagePicker,
  },
  setup() {
    const { presentToast } = useToast()
    const categoryStore = useCategoryStore()
    const authStore = useAuthStore()
    const router = useIonRouter()

    const newCategoryName = ref('')
    const newCategoryImage = ref<File | null>(null)
    const loading = ref(false)
    const showModal = ref(false)

    const editModalVisible = ref(false)
    const editCategoryData = ref<EditableCategory>({ id: null, name: '', image: null })

    onIonViewWillEnter(() => {
      categoryStore.fetchCategories()
      authStore.fetchUser()
    })

    const addCategory = async () => {
      if (!newCategoryName.value.trim()) {
        await presentToast('Podaj nazwę kategorii!', 'warning')
        return
      }

      loading.value = true
      try {
        await categoryStore.addCategory(newCategoryName.value.trim(), newCategoryImage.value)
        newCategoryName.value = ''
        newCategoryImage.value = null
      } finally {
        loading.value = false
      }
    }

    const editCategory = (category: Category) => {
      editCategoryData.value = {
        id: category.id,
        name: category.name,
        image: category.image || null,
      }
      editModalVisible.value = true
    }

    const updateCategory = async () => {
      if (!editCategoryData.value.name.trim()) {
        await presentToast('Podaj nazwę kategorii!', 'warning')
        return
      }

      if (editCategoryData.value.id === null) {
        await presentToast('Błąd: Brak ID kategorii!', 'danger')
        return
      }

      await categoryStore.updateCategory(editCategoryData.value.id, {
        name: editCategoryData.value.name,
        image: editCategoryData.value.image,
      })

      closeEditModal()
    }

    const closeEditModal = () => {
      editModalVisible.value = false
      editCategoryData.value = { id: null, name: '', image: null }
    }

    const deleteCategory = async (category: Category) => {
      const alertModal = await alertController.create({
        header: 'Usuwanie',
        subHeader: `Czy na pewno chcesz usunąć tę kategorię ${category.name}?`,
        buttons: [
          { text: 'NIE', role: 'cancel' },
          {
            text: 'TAK',
            role: 'confirm',
            handler: async () => {
              await categoryStore.deleteCategory(category.id)
              await presentToast('Kategoria została usunięta!', 'success')
            },
          },
        ],
      })

      await alertModal.present()
    }

    const goToCategory = (categoryId: number | null) => {
      router.push(`/category/${categoryId}`)
    }

    return {
      sunnyOutline,
      createOutline,
      categoryStore,
      authStore,
      newCategoryName,
      newCategoryImage,
      loading,
      showModal,
      editModalVisible,
      editCategoryData,
      addCategory,
      editCategory,
      updateCategory,
      closeEditModal,
      deleteCategory,
      goToCategory,
    }
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/media.scss';

.greeting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0 0 0;
}

.user {
  margin: 0 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: bolder;
}

.category {
  font-weight: bolder;
  margin: 2rem 0 0 0;
}

ion-item {
  --padding-start: 20px;
  --inner-padding-end: 20px;
  font-size: 1.1rem;
}

ion-modal {
  --height: 90%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

ion-thumbnail img {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
}

.add-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  @include media(md) {
    right: 4rem;
  }
}
</style>
