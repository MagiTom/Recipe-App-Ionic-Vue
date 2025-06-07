<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj Przepis</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-input
          label="Tytuł"
          label-placement="floating"
          v-model="title"
        />
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label="Strona"
          label-placement="floating"
          v-model="url"
        />
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label="Składniki"
          label-placement="floating"
          v-model="ingredients"
        />
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label="Instrukcje"
          label-placement="floating"
          v-model="instructions"
        />
      </ion-item>

      <ion-item>
        <ion-select
          label="Kategoria"
          label-placement="floating"
          v-model="category"
        >
          <ion-select-option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label>Dodaj obrazek</ion-label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleImageUpload"
        />
        <ion-button
          :disabled="!imagePreview"
          color="danger"
          fill="outline"
          size="large"
          @click="removeNewImage"
        >
          <ion-icon :icon="trashOutline" />
        </ion-button>
        <ion-button
          fill="outline"
          size="large"
          @click="$refs.fileInput?.click()"
        >
          <ion-icon :icon="addIcon" />
        </ion-button>
      </ion-item>

      <ion-item>
        <ion-label>Podgląd</ion-label>
        <ion-thumbnail @click="$refs.fileInput?.click()">
          <img
            :src="imagePreview || defaultThumbnail"
            alt="Preview"
          />
        </ion-thumbnail>
      </ion-item>

      <ion-button expand="block" @click="addRecipe">
        Dodaj Przepis
      </ion-button>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonThumbnail, useIonRouter
} from '@ionic/vue'
import { add, trashOutline } from 'ionicons/icons'
import { useToast } from '@/composables/useToast.ts'
import { useRecipeStore } from '../stores/recipeStore'
import { useCategoryStore } from '../stores/categoryStore'

export default defineComponent({
  name: 'AddRecipe',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonSelect,
    IonSelectOption, IonButton, IonIcon, IonThumbnail,
  },
  setup() {
    const title = ref('')
    const url = ref('')
    const ingredients = ref('')
    const instructions = ref('')
    const category = ref<number | null>(null)
    const newImage = ref<File | null>(null)
    const imagePreview = ref<string | null>(null)
    const fileInput = ref<HTMLInputElement | null>(null)

    const { presentToast } = useToast()
    const recipeStore = useRecipeStore()
    const categoryStore = useCategoryStore()
    const ionRouter = useIonRouter()

    const categories = computed(() => categoryStore.categories)

    const handleImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null
      newImage.value = file

      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          imagePreview.value = reader.result as string
        }
        reader.readAsDataURL(file)
      } else {
        imagePreview.value = null
      }
    }

    const removeNewImage = () => {
      newImage.value = null
      imagePreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const addRecipe = async () => {
      if (!title.value || !url.value || !ingredients.value || !instructions.value || category.value === null) {
        await presentToast('Uzupełnij wszystkie pola!', 'warning')
        return
      }

      const formData = new FormData()
      formData.append('title', title.value)
      formData.append('url', url.value)
      formData.append('ingredients', ingredients.value)
      formData.append('instructions', instructions.value)
      formData.append('category', category.value.toString())
      if (newImage.value) {
        formData.append('image', newImage.value)
      }

      await recipeStore.addRecipe(formData)
      title.value = ''
      url.value = ''
      ingredients.value = ''
      instructions.value = ''
      category.value = null
      newImage.value = null
      imagePreview.value = null
      ionRouter.back()
    }

    onMounted(() => {
      categoryStore.fetchCategories()
    })

    return {
      title,
      url,
      ingredients,
      instructions,
      category,
      categories,
      handleImageUpload,
      removeNewImage,
      addRecipe,
      fileInput,
      imagePreview,
      addIcon: add,
      trashOutline,
      defaultThumbnail: 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
    }
  }
})
</script>

