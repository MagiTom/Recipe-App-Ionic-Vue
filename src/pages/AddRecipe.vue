<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dodaj Przepis</ion-title>
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

      <ion-button expand="block" @click="addRecipe">Dodaj Przepis</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRecipeStore } from '../stores/recipeStore'; // Twoja pinia store
import { useCategoryStore } from '../stores/categoryStore'; // Zakładam, że masz osobną store do kategorii
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton } from '@ionic/vue';

export default defineComponent({
  name: 'AddRecipe',
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
  setup() {
    const recipeStore = useRecipeStore();
    const categoryStore = useCategoryStore();

    const title = ref('');
    const description = ref('');
    const ingredients = ref('');
    const instructions = ref('');
    const category = ref<number | null>(null);

    const categories = computed(() => categoryStore.categories);

    const addRecipe = async () => {
      if (!title.value || !description.value || !ingredients.value || !instructions.value || category.value === null) {
        alert('Uzupełnij wszystkie pola!');
        return;
      }

      await recipeStore.addRecipe({
        title: title.value,
        description: description.value,
        ingredients: ingredients.value,
        instructions: instructions.value,
        category: category.value,
      });

      alert('Przepis dodany!');
      title.value = '';
      description.value = '';
      ingredients.value = '';
      instructions.value = '';
      category.value = null;
    };

    onMounted(() => {
      // categoryStore.fetchCategories();
    });

    return {
      title,
      description,
      ingredients,
      instructions,
      category,
      categories,
      addRecipe,
    };
  },
});
</script>
