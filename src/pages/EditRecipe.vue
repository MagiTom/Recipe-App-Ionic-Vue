<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Edytuj Przepis</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-label position="floating">Tytuł</ion-label>
        <ion-input v-model="title"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Opis</ion-label>
        <ion-textarea v-model="description"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Składniki</ion-label>
        <ion-textarea v-model="ingredients"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Instrukcje</ion-label>
        <ion-textarea v-model="instructions"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label>Kategoria</ion-label>
        <ion-select v-model="category">
          <ion-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Image Section -->
      <ion-item>
        <ion-label>Aktualny obrazek</ion-label>
        <ion-thumbnail slot="end" v-if="image">
          <img :src="image" alt="Recipe Image" />
        </ion-thumbnail>
        <ion-button slot="end" color="danger" @click="removeImage" v-if="image">Usuń obrazek</ion-button>
      </ion-item>

      <ion-item>
        <ion-label>Dodaj/Zmień obrazek</ion-label>
        <input type="file" accept="image/*" @change="handleImageUpload" />
      </ion-item>

      <ion-button expand="block" @click="saveRecipe">Zapisz</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useCategoryStore } from '@/stores/categoryStore';
import { useRecipeStore } from '@/stores/recipeStore';
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
} from '@ionic/vue';
import { ref, watch } from 'vue';

export default {
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
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const recipeStore = useRecipeStore();
    const categoryStore = useCategoryStore();
    const ionRouter = useIonRouter();
    const title = ref('');
    const description = ref('');
    const ingredients = ref('');
    const instructions = ref('');
    const category = ref<number | null>(null);
    const categories = ref<{ id: number; name: string }[]>([]);
    const image = ref<string | null>(null);
    const newImage = ref<File | null>(null);
      const editRecipeData = ref<{
      id: number
      title: string
      description: string
      ingredients: string
      instructions: string
      category: number
      image: string | null
    }>();

    const fetchRecipeDetails = async (id: number) => {
      try {
        const recipe = await recipeStore.fetchRecipeDetails(id);
        editRecipeData.value = {...recipe};
        if (recipe) {
          title.value = recipe.title;
          description.value = recipe.description;
          ingredients.value = recipe.ingredients;
          instructions.value = recipe.instructions;
          category.value = recipe.category;
          image.value = recipe.image; // Set current image
        }
      } catch (error) {
        console.error('Błąd podczas pobierania szczegółów przepisu:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        await categoryStore.fetchCategories();
        categories.value = categoryStore.categories;
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      }
    };

    const handleImageUpload = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0] || null;
      newImage.value = file;
    };

    const removeImage = () => {
      newImage.value = null;
      image.value = null;
    };

    const saveRecipe = async () => {
      const recipeId = editRecipeData.value?.id;
      if (!recipeId) {
        console.error('Nieprawidłowe ID przepisu');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('title', title.value);
        formData.append('description', description.value);
        formData.append('ingredients', ingredients.value);
        formData.append('instructions', instructions.value);
        formData.append('category', category.value?.toString() || '');
        if (newImage.value) {
          formData.append('image', newImage.value);
        } else if (!image.value) {
          formData.append('image', ''); // Indicate removal of image
        }

        await recipeStore.editRecipe(recipeId, formData);
        ionRouter.back()
      } catch (error) {
        console.error('Błąd podczas zapisywania przepisu:', error);
      }
    };

    watch(
      () => props,
      (newId) => {
        if (newId) {
          fetchRecipeDetails(Number(newId.id));
          fetchCategories();
        }
      },
      { immediate: true }
    );

    return {
      title,
      description,
      ingredients,
      instructions,
      category,
      categories,
      image,
      newImage,
      handleImageUpload,
      removeImage,
      saveRecipe,
    };
  },
};
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
