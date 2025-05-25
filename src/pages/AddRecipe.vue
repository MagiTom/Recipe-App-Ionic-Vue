<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj Przepis</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input label-placement="floating" label="Tytuł" v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea auto-grow label-placement="floating" label="Opis" v-model="url"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label-placement="floating"
          label="Składniki"
          v-model="ingredients"
        ></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label-placement="floating"
          label="Instrukcje"
          v-model="instructions"
        ></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-select label-placement="floating" label="Kategoria" v-model="category">
          <ion-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
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
      <ion-button expand="block" @click="addRecipe">Dodaj Przepis</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { useCategoryStore } from '../stores/categoryStore'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  useIonRouter,
  IonIcon, IonThumbnail
} from '@ionic/vue'
import { add, trashOutline } from 'ionicons/icons'
import { useToast } from '@/composables/useToast.ts'

export default defineComponent({
  name: 'AddRecipe',
  methods: {
    add() {
      return add
    },
    trashOutline() {
      return trashOutline
    }
  },
  components: {
    IonThumbnail,
    IonIcon,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
  },
  setup() {
    const recipeStore = useRecipeStore()
    const categoryStore = useCategoryStore()
    const ionRouter = useIonRouter()
    const title = ref('')
    const url = ref('')
    const ingredients = ref('')
    const instructions = ref('')
    const category = ref<number | null>(null)
    const image = ref<File | null>(null)
    const newImage = ref<File | null>(null)
    const imagePreview = ref<string | null>(null)
    const fileInput = ref<HTMLInputElement | null>(null)
    const { presentToast } = useToast();

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
      if (
        !title.value ||
        !url.value ||
        !ingredients.value ||
        !instructions.value ||
        category.value === null
      ) {
        await presentToast('Uzupełnij wszystkie pola!', 'warning');
        return
      }

      const formData = new FormData()
      formData.append('title', title.value)
      formData.append('description', url.value)
      formData.append('ingredients', ingredients.value)
      formData.append('instructions', instructions.value)
      formData.append('category', category.value.toString())
      if (image.value) {
        formData.append('image', image.value)
      }

      await recipeStore.addRecipe(formData)

      await presentToast('Przepis dodany!', 'success');
      title.value = ''
      url.value = ''
      ingredients.value = ''
      instructions.value = ''
      category.value = null
      image.value = null
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
      image,
      categories,
      handleImageUpload,
      addRecipe,
      removeNewImage,
      imagePreview
    }
  },
})
</script>
