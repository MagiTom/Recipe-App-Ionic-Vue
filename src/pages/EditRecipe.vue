<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Edytuj Przepis</ion-title>
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
        <ion-label>Podgląd obrazka</ion-label>
        <ion-thumbnail slot="end">
          <img :src="image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'" alt="image" />
        </ion-thumbnail>
      </ion-item>

      <ion-item>
        <ion-label>Zmień obrazek</ion-label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleImageUpload($event)"
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

      <ion-button expand="block" @click="saveRecipe">Zapisz</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useCategoryStore } from '@/stores/categoryStore'
import { useRecipeStore } from '@/stores/recipeStore'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  useIonRouter,
  IonIcon,
} from '@ionic/vue'
import { ref, watch } from 'vue'
import { createOutline, trashOutline } from 'ionicons/icons'
import { useToast } from '@/composables/useToast.ts'

export default {
  name: 'EditRecipe',
  methods: {
    trashOutline() {
      return trashOutline
    },
    createOutline() {
      return createOutline
    }
  },
  components: {
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
    IonThumbnail,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const { presentToast } = useToast();
    const recipeStore = useRecipeStore()
    const categoryStore = useCategoryStore()
    const ionRouter = useIonRouter()
    const title = ref('')
    const description = ref('')
    const ingredients = ref('')
    const instructions = ref('')
    const category = ref<number | null>(null)
    const categories = ref<{ id: number; name: string }[]>([])
    const image = ref<string | null>(null)
    const newImage = ref<File | null>(null)
    const fileInput = ref<HTMLInputElement | null>(null)
    const editRecipeData = ref<{
      id: number
      title: string
      url: string
      ingredients: string
      instructions: string
      category: number
      image: string | null
    }>()

    const fetchRecipeDetails = async (id: number) => {
      try {
        const recipe = await recipeStore.fetchRecipeDetails(id)
        editRecipeData.value = { ...recipe }
        if (recipe) {
          title.value = recipe.title
          url.value = recipe.url
          ingredients.value = recipe.ingredients
          instructions.value = recipe.instructions
          category.value = recipe.category
          image.value = recipe.image // Set current image
        }
      } catch (error: any) {
        await presentToast('Błąd podczas pobierania szczegółów przepisu:' + (error.response?.data?.details?.detail))
      }
    }

    const fetchCategories = async () => {
      try {
        await categoryStore.fetchCategories()
        categories.value = categoryStore.categories
      } catch (error: any) {
        await presentToast('Błąd podczas pobierania kategorii:' + (error.response?.data?.details?.detail))
      }
    }


    const handleImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null

      newImage.value = file

      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          image.value = reader.result as string
        }
        reader.readAsDataURL(file)
      } else {
        image.value = null
      }
    }

    const removeImage = () => {
      newImage.value = null
      image.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const saveRecipe = async () => {
      const recipeId = editRecipeData.value?.id
      if (!recipeId) {
        await presentToast('Nieprawidłowe ID przepisu', 'danger');
        return
      }

      try {
        const formData = new FormData()
        formData.append('title', title.value)
        formData.append('url', url.value)
        formData.append('ingredients', ingredients.value)
        formData.append('instructions', instructions.value)
        formData.append('category', category.value?.toString() || '')
        if (newImage.value) {
          formData.append('image', newImage.value)
        } else if (!image.value) {
          formData.append('image', '') // Indicate removal of image
        }

        await recipeStore.editRecipe(recipeId, formData)
        ionRouter.back()
      } catch (error: any) {
        await presentToast('Błąd podczas zapisywania przepisu:' + (error.response?.data?.details?.detail))
      }
    }

    watch(
      () => props,
      (newId) => {
        if (newId) {
          fetchRecipeDetails(Number(newId.id))
          fetchCategories()
        }
      },
      { immediate: true },
    )

    return {
      title,
      url,
      ingredients,
      instructions,
      category,
      categories,
      image,
      newImage,
      handleImageUpload,
      removeImage,
      saveRecipe,
    }
  },
}
</script>

<style scoped>
ion-item {
  margin-bottom: 16px;
}
ion-thumbnail img {
  max-height: 100px;
  max-width: 100px;
  object-fit: cover;
}

</style>
