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
            <ion-card  @click="goToRecipe(recipe.id)">
              <ion-card-header>
                <ion-card-title>{{ recipe.title }}</ion-card-title>
                <ion-card-subtitle>{{ recipe.description }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-button @click.stop="goToRecipe(recipe.id)" color="primary">Szczegóły</ion-button>
                <ion-button @click.stop="editRecipe(recipe.id)" color="secondary">Edytuj</ion-button>
                <ion-button @click.stop="deleteRecipe(recipe.id)" color="danger">Usuń</ion-button>
              </ion-card-content>
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
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonRouter,
  alertController,
  IonCardContent, // Dodany import
} from '@ionic/vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRecipeStore } from '../stores/recipeStore' // Twoje Pinia store

export default defineComponent({
  name: 'RecipeList',
  components: {
    IonLoading,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonButton,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const recipeStore = useRecipeStore()
    const router = useIonRouter()
    const loading = ref(false)

    const recipes = computed(() => recipeStore.recipes)

    const fetchRecipes = async (categoryId: number) => {
      loading.value = true
      if (!categoryId) {
        await recipeStore.fetchAllRecipes()
      } else {
        await recipeStore.fetchRecipesByCategory(categoryId)
      }
      loading.value = false
    }

    const goToRecipe = (recipeId: number) => {
      router.push(`/recipe/${recipeId}`)
    }

    const deleteRecipe = async (recipeId: number) => {
      const alert = await alertController.create({
        header: 'Potwierdzenie',
        message: 'Czy na pewno chcesz usunąć ten przepis?',
        buttons: [
          {
            text: 'Anuluj',
            role: 'cancel',
            handler: () => {
              console.log('Użytkownik anulował usunięcie przepisu.')
            },
          },
          {
            text: 'Usuń',
            role: 'confirm',
            handler: async () => {
              try {
                await recipeStore.deleteRecipe(recipeId)
                console.log(`Przepis o ID ${recipeId} został usunięty.`)
              } catch (error) {
                console.error('Błąd podczas usuwania przepisu:', error)
              }
            },
          },
        ],
      })

      await alert.present() // Wyświetlenie alertu
    }

    const editRecipe = (recipeId: number) => {
      router.push(`/edit-recipe/${recipeId}`)
    }

    watch(
      () => props,
      (newId) => {
        if (newId) {
          fetchRecipes(Number(newId.id))
        }
      },
      { immediate: true },
    )

    return {
      recipes,
      loading,
      goToRecipe,
      deleteRecipe,
      editRecipe,
    }
  },
})
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
