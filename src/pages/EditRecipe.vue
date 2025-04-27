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
      <ion-button expand="block" @click="saveRecipe">Zapisz</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useCategoryStore } from '@/stores/categoryStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
    const route = useRoute();
    const router = useRouter();

    const title = ref('');
    const description = ref('');
    const ingredients = ref('');
    const instructions = ref('');
    const category = ref<number | null>(null);
    const categories = ref<{ id: number; name: string }[]>([]);

    const fetchRecipeDetails = async (id: number) => {
      try {
        const recipe = await recipeStore.fetchRecipeDetails(id);
        if (recipe) {
          title.value = recipe.title;
          description.value = recipe.description;
          ingredients.value = recipe.ingredients;
          instructions.value = recipe.instructions;
          category.value = recipe.category;
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

    const saveRecipe = async () => {
      const recipeId = Number(route.params?.id); // Bezpieczne pobranie ID z URL
      if (!recipeId) {
        console.error('Nieprawidłowe ID przepisu');
        return;
      }

      try {
        await recipeStore.editRecipe(recipeId, {
          title: title.value,
          description: description.value,
          ingredients: ingredients.value,
          instructions: instructions.value,
          category: category.value || 0,
        });
        router.push('/'); // Przekierowanie po zapisaniu
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
      saveRecipe,
    };
  },
};
</script>

<style scoped>
ion-item {
  margin-bottom: 16px;
}
</style>
