<template>
  <ion-page>

    <ion-content class="ion-padding">
      <p class="greeting">
        <ion-text color="primary"><ion-icon size="large" :icon="sunnyOutline()"></ion-icon></ion-text>
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
          <ion-col size="12" size-md="6"   v-for="category in categoryStore.categories"
                     :key="category.id">
            <ion-card

              button
              @click="goToCategory(category.id)"
            >
              <ion-card-header>
                <div class="card-header">
                  <ion-thumbnail>
                    <img
                      alt="Category image"
                      :src="category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
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

          <ion-item>
            <ion-label>Dodaj obrazek</ion-label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="handleImageUpload($event, 'new')"
            />
            <ion-button
              disable="imagePreview"
              color="danger"
              fill="outline"
              size="large"
              @click="removeNewImage"
            >
              <ion-icon slot="icon-only" :icon="trashOutline()"></ion-icon>
            </ion-button>
            <ion-button fill="outline" size="large" @click="$refs.fileInput.click()">
              <ion-icon slot="icon-only" :icon="add()"></ion-icon>
            </ion-button>
          </ion-item>

          <ion-item>
            <ion-label>Podgląd</ion-label>
            <ion-thumbnail slot="end" @click="$refs.fileInput.click()">
              <img
                :src="imagePreview || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
                alt="Category image"
              />
            </ion-thumbnail>
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
            <ion-item v-for="category in categoryStore.categories" :key="category.id">
              <ion-thumbnail slot="start">
                <img
                  alt="Category image"
                  :src="category.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"
                />
              </ion-thumbnail>
              <span style="flex-grow: 1">{{ category.name }}</span>
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
                  label="Nazwa kategoriii"
                  v-model="editCategoryData.name"
                  clear-input
                ></ion-input>
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
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="handleImageUpload($event, 'edit')"
                />

                <ion-button fill="outline" size="large" @click="$refs.fileInput.click()">
                  <ion-icon slot="icon-only" :icon="createOutline()"></ion-icon>
                </ion-button>
                <ion-button
                  color="danger"
                  disable="editCategoryData.image"
                  fill="outline"
                  size="large"
                  @click="removeImage"
                >
                  <ion-icon slot="icon-only" :icon="trashOutline()"></ion-icon>
                </ion-button>
              </ion-item>
              <ion-button expand="block" class="ion-margin-top" @click="updateCategory">
                Zapisz zmiany
              </ion-button>
            </ion-content>
          </ion-modal>
        </ion-content>
      </ion-modal>
      <ion-fab>
        <ion-fab-button
          @click="showModal = true"
          class="add-button"
          size="large"
          shape="round"
          v-if="!loading"
        >
          <ion-icon :icon="createOutline()"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
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
  IonModal,
  IonButtons,
  IonThumbnail,
  IonIcon,
  alertController,
  IonItemDivider,
  IonCol, onIonViewWillEnter, IonFabButton, IonFab
} from '@ionic/vue'
import { useMainStore } from '../store'
import { useCategoryStore } from '../stores/categoryStore'
import { useAuthStore } from '@/stores/authStore.ts'
import { useIonRouter } from '@ionic/vue'
import { add, createOutline, removeOutline, sunnyOutline, trashOutline } from 'ionicons/icons'
import { useToast } from '@/composables/useToast.ts'

export default defineComponent({
  name: 'Home',
  methods: {
    sunnyOutline() {
      return sunnyOutline
    },
    trashOutline() {
      return trashOutline
    },
    removeOutline() {
      return removeOutline
    },
    createOutline() {
      return createOutline
    },
    add() {
      return add
    },
  },
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
    IonFab
  },
  setup() {
    const { presentToast } = useToast()
    const mainStore = useMainStore()
    const categoryStore = useCategoryStore()
    const router = useIonRouter()
    const authStore = useAuthStore()

    const newCategoryName = ref('')
    const newCategoryImage = ref<File | null>(null)
    const imagePreview = ref<string | null>(null)
    const loading = ref(false)
    const showModal = ref(false)

    const editModalVisible = ref(false)
    const editCategoryData = ref({ id: null, name: '', image: null })
    const editCategoryImagePreview = ref<string | null>(null)
    const fileInput = ref<HTMLInputElement | null>(null)

    onIonViewWillEnter(() => {
      categoryStore.fetchCategories()
      authStore.fetchUser()
    })

    const handleImageUpload = (event: Event, type: 'new' | 'edit') => {
      const file = (event.target as HTMLInputElement).files?.[0] || null

      if (type === 'new') {
        newCategoryImage.value = file

        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = () => {
            imagePreview.value = reader.result as string
          }
          reader.readAsDataURL(file)
        } else {
          imagePreview.value = null
        }
      } else if (type === 'edit') {
        editCategoryData.value.image = file

        if (file) {
          if (editCategoryImagePreview.value) {
            URL.revokeObjectURL(editCategoryImagePreview.value)
          }
          editCategoryImagePreview.value = URL.createObjectURL(file)
        } else {
          editCategoryImagePreview.value = null
        }
      }
    }

    const removeNewImage = () => {
      newCategoryImage.value = null
      imagePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const removeImage = () => {
      if (editCategoryImagePreview.value) {
        URL.revokeObjectURL(editCategoryImagePreview.value)
      }
      editCategoryImagePreview.value = null
      editCategoryData.value.image = null
    }

    const addCategory = async () => {
      if (!newCategoryName.value.trim()) {
        await presentToast('Podaj nazwę kategorii!', 'warning')
        return
      }
      loading.value = true
      try {
        await categoryStore.addCategory(newCategoryName.value.trim(), newCategoryImage.value)
        await categoryStore.fetchCategories()
        await presentToast('Kategoria została dodana!', 'success')
        newCategoryName.value = ''
        newCategoryImage.value = null
        imagePreview.value = null
      } catch (err: any) {
        await presentToast('Błąd dodawania kategorii: ' + err.response?.data?.details?.detail)
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
        await presentToast('Podaj nazwę kategorii!', 'warning')
        return
      }
      try {
        await categoryStore.updateCategory(editCategoryData.value.id, {
          name: editCategoryData.value.name,
          image: editCategoryData.value.image,
        })
        await categoryStore.fetchCategories()
        await presentToast('Kategoria została zaktualizowana!', 'success')
        closeEditModal()
      } catch (err: any) {
        await presentToast(
          'Błąd aktualizacji kategorii: ' + err.response?.data?.details?.detail,
          'danger',
        )
      }
    }

    const closeEditModal = () => {
      editModalVisible.value = false
      editCategoryData.value = { id: null, name: '', image: null }
    }

    const deleteCategory = async (category: any) => {
      const alertModal = await alertController.create({
        header: 'Usuwanie',
        subHeader: `Czy na pewno chcesz usunąć tę kategorię ${category.name}?`,
        buttons: [
          {
            text: 'NIE',
            role: 'cancel',
          },
          {
            text: 'TAK',
            role: 'confirm',
            handler: async () => {
              try {
                await categoryStore.deleteCategory(category.id)
                await presentToast('Kategoria została usunięta!', 'success')
              } catch (err: any) {
                await presentToast(
                  'Błąd usuwania kategorii: ' + err.response?.data?.details?.detail,
                  'danger',
                )
              }
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
      mainStore,
      categoryStore,
      newCategoryName,
      newCategoryImage,
      imagePreview,
      loading,
      showModal,
      editModalVisible,
      editCategoryData,
      editCategoryImagePreview,
      addCategory,
      editCategory,
      updateCategory,
      deleteCategory,
      closeEditModal,
      handleImageUpload,
      removeImage,
      goToCategory,
      removeNewImage,
      fileInput,
      IonItemDivider,
      authStore,
    }
  },
})
</script>

<style scoped>
.greeting{
  display: flex;
  align-items: center;
  gap: .5rem;
  margin: 1rem 0 0 0;
}
.user{
  margin: 0 0 0 .5rem;
  font-size: 1.2rem;
  font-weight: bolder;
}
.category{
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

.image-preview {
  margin-top: 16px;
  text-align: center;
}
.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.add-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
}
</style>
