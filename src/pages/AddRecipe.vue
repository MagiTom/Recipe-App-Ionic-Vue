<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj Przepis</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item>
        <ion-input label="Tytuł" label-placement="floating" v-model="title" />
      </ion-item>

      <ion-item>
        <ion-textarea auto-grow label="Strona" label-placement="floating" v-model="url" />
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
        <ion-select label="Kategoria" label-placement="floating" v-model="category">
          <ion-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <ImagePicker @update:image="newImage = $event" />

      <ion-button class="ion-padding" expand="block" @click="addRecipe"> Dodaj Przepis </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useToast } from '@/composables/useToast.ts'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/vue'
import { add, trashOutline } from 'ionicons/icons'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useCategoryStore } from '../stores/categoryStore'
import { useRecipeStore } from '../stores/recipeStore'
import ImagePicker from './../components/ImagePicker.vue'


export default defineComponent({
  name: 'AddRecipe',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    ImagePicker
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
      if (
        !title.value ||
        !url.value ||
        !ingredients.value ||
        !instructions.value ||
        category.value === null
      ) {
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
      newImage
    }
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/media.scss';

ion-content::part(scroll)  {
  @include media(lg) {
    width: 50%;
    margin: 4rem auto;
  }
}
</style>
