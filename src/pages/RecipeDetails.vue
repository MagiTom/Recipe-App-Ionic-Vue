<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Przepis</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card v-if="recipe">
        <ion-card-header>
          <img alt="recipe image" :src="recipe.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"/>
          <ion-card-title>{{ recipe.title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Opis:</strong> {{ recipe.description }}</p>

          <div v-if="ingredientsList.length">
            <strong>Składniki:</strong>
            <ul>
              <li v-for="(ingredient, index) in ingredientsList" :key="index">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div v-if="recipe.instructions">
            <strong>Instrukcje:</strong>
            <p>{{ recipe.instructions }}</p>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card v-else>
        <ion-card-content class="ion-text-center">
          <ion-spinner name="dots"></ion-spinner>
          <p>Ładowanie przepisu...</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRecipeStore } from '@/stores/recipeStore'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { computed, defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'RecipeDetails',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonThumbnail,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const recipeStore = useRecipeStore()

    watch(
      () => props,
      (newId) => {
        if (newId) {
          recipeStore.fetchRecipeDetails(Number(newId.id))
        }
      },
      { immediate: true },
    )

    const recipe = computed(() => recipeStore.recipeDetails)
    const ingredientsList = computed(() => {
      if (!recipe.value || typeof recipe.value.ingredients !== 'string') return []
      return recipe.value.ingredients.split(',').map((item) => item.trim())
    })

    return {
      recipe,
      ingredientsList,
    }
  },
})
</script>
