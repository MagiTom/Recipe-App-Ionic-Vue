<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Przepisy</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-loading :is-open="loading" message="Ładowanie przepisów..." spinner="crescent" />

      <ion-grid v-if="!loading">
        <ion-row>
          <ion-col size="12" size-md="6" v-for="recipe in recipes" :key="recipe.id">
            <ion-card @click="goToRecipe(recipe.id)" button>
              <ion-card-header>
                <ion-card-title>{{ recipe.title }}</ion-card-title>
                <ion-card-subtitle>{{ recipe.description }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div v-if="!loading && recipes.length === 0" class="empty-message">
        Brak przepisów w tej kategorii 😥
      </div>

      <ion-button expand="full" router-link="/add-recipe" class="add-button" v-if="!loading">
        Dodaj Przepis
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // 🛠️ poprawione tutaj
import { IonLoading } from '@ionic/vue'; // tylko komponent Ionic
import { useRecipeStore } from '../stores/recipeStore'; // Twoje Pinia store


export default defineComponent({
  name: 'RecipeList',
  components: { IonLoading },
  setup() {
  const recipeStore = useRecipeStore();
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);

  const recipes = computed(() => recipeStore.recipes);

  const fetchRecipes = async (categoryId: number) => {
    loading.value = true;
    await recipeStore.fetchRecipesByCategory(categoryId);
    loading.value = false;
  };

  const goToRecipe = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  onMounted(() => {
    if (route?.params?.id) {
      fetchRecipes(Number(route.params.id));
    }
  });

  watch(
    () => route?.params?.id,
    (newId) => {
      if (newId) {
        fetchRecipes(Number(newId));
      }
    }
  );

  return {
    recipes,
    loading,
    goToRecipe,
  };
}
});
</script>

<style scoped>

ion-card {
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 16px;
}

ion-card:hover {
  transform: scale(1.02);
}

.add-button {
  margin: 16px;
}

.empty-message {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: gray;
}
</style>
