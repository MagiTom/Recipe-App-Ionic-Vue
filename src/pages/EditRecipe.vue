<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Edytuj Przepis</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-input label-placement="floating" label="Tytuł" v-model="title" />
      </ion-item>

      <ion-item>
        <ion-textarea auto-grow label-placement="floating" label="Strona" v-model="url" />
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label-placement="floating"
          label="Składniki"
          v-model="ingredients"
        />
      </ion-item>

      <ion-item>
        <ion-textarea
          auto-grow
          label-placement="floating"
          label="Instrukcje"
          v-model="instructions"
        />
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
        <ion-thumbnail>
          <img :src="image || placeholder" alt="image" />
        </ion-thumbnail>
      </ion-item>

      <ion-item>
        <ion-label>Zmień obrazek</ion-label>
        <input ref="fileInput" type="file" accept="image/*" hidden @change="handleImageUpload" />
        <ion-button fill="outline" size="large" @click="triggerFileInput">
          <ion-icon :icon="createOutlineIcon" />
        </ion-button>
        <ion-button
          color="danger"
          fill="outline"
          size="large"
          @click="removeImage"
          :disabled="!image"
        >
          <ion-icon :icon="trashOutlineIcon" />
        </ion-button>
      </ion-item>

      <ion-button expand="block" @click="saveRecipe">Zapisz</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
  IonThumbnail,
  IonIcon,
  useIonRouter,
} from '@ionic/vue'
import { defineComponent, ref, onMounted } from 'vue'
import { createOutline, trashOutline } from 'ionicons/icons'
import { useCategoryStore } from '@/stores/categoryStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { useToast } from '@/composables/useToast'

export default defineComponent({
  name: 'EditRecipe',
  components: {
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
    IonIcon,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const { presentToast } = useToast()
    const recipeStore = useRecipeStore()
    const categoryStore = useCategoryStore()
    const ionRouter = useIonRouter()

    const title = ref('')
    const url = ref('')
    const ingredients = ref('')
    const instructions = ref('')
    const category = ref<number | null>(null)
    const image = ref<string | null>(null)
    const newImage = ref<File | null>(null)
    const categories = ref<{ id: number; name: string }[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)

    const placeholder = 'https://ionicframework.com/docs/img/demos/thumbnail.svg'
    const createOutlineIcon = createOutline
    const trashOutlineIcon = trashOutline

    const fetchRecipeDetails = async (id: number) => {
      const recipe = await recipeStore.fetchRecipeDetails(id)
      title.value = recipe.title
      url.value = recipe.url
      ingredients.value = recipe.ingredients
      instructions.value = recipe.instructions
      category.value = recipe.category
      image.value = recipe.image
    }

    const fetchCategories = async () => {
      await categoryStore.fetchCategories()
      categories.value = categoryStore.categories
    }

    const handleImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return

      newImage.value = file

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          image.value = reader.result as string
        }
        reader.readAsDataURL(file)
      } else {
        image.value = null
      }
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const removeImage = () => {
      newImage.value = null
      image.value = null
      if (fileInput.value) fileInput.value.value = ''
    }

    const saveRecipe = async () => {
      if (!props.id) {
        await presentToast('Nieprawidłowe ID przepisu', 'danger')
        return
      }
      const formData = new FormData()
      formData.append('title', title.value)
      formData.append('url', url.value)
      formData.append('ingredients', ingredients.value)
      formData.append('instructions', instructions.value)
      formData.append('category', category.value?.toString() || '')

      if (newImage.value) {
        formData.append('image', newImage.value)
      } else if (!image.value) {
        formData.append('image', '')
      }

      await recipeStore.editRecipe(Number(props.id), formData)
      ionRouter.back()
    }

    onMounted(() => {
      fetchRecipeDetails(Number(props.id))
      fetchCategories()
    })

    return {
      title,
      url,
      ingredients,
      instructions,
      category,
      categories,
      image,
      newImage,
      fileInput,
      placeholder,
      createOutlineIcon,
      trashOutlineIcon,
      handleImageUpload,
      triggerFileInput,
      removeImage,
      saveRecipe,
    }
  },
})
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
