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
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddRecipe',
  setup() {
    const store = useStore();
    const title = ref('');
    const description = ref('');
    const ingredients = ref('');
    const instructions = ref('');
    const category = ref(null);

    const addRecipe = async () => {
      await store.dispatch('recipe/addRecipe', {
        title: title.value,
        description: description.value,
        ingredients: ingredients.value,
        instructions: instructions.value,
        category: category.value,
      });
      alert('Przepis dodany!');
    };

    onMounted(() => {
      store.dispatch('category/fetchCategories');
    });

    return {
      title,
      description,
      ingredients,
      instructions,
      category,
      categories: store.getters['category/getCategories'],
      addRecipe,
    };
  },
});
</script>
