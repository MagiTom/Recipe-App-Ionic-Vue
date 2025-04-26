<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Przepis</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ recipe?.title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Opis:</strong> {{ recipe?.description }}</p>
          <p><strong>Składniki:</strong> {{ recipe?.ingredients }}</p>
          <p><strong>Instrukcje:</strong> {{ recipe?.instructions }}</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'RecipeDetails',
  setup() {
    const store = useStore();
    const route = useRoute();

    onMounted(() => {
      store.dispatch('recipe/fetchRecipeDetails', route.params.id);
    });

    return {
      recipe: store.getters['recipe/getRecipeDetails'],
    };
  },
});
</script>
