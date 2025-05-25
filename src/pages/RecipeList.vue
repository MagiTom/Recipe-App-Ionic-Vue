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
          <ion-col size="6" size-md="4" size-lg="3" v-for="recipe in recipes" :key="recipe.id">
            <ion-card @click="goToRecipe(recipe.id)">
              <ion-card-header>
                <ion-button class="nextBtn" shape="round">
                  <ion-icon slot="icon-only" :icon="arrowForwardOutline()"></ion-icon>
                </ion-button>
                <img alt="recipe image" :src="recipe.image || 'https://ionicframework.com/docs/img/demos/thumbnail.svg'"/>
                <ion-card-title>
                 {{ recipe.title }}
                </ion-card-title>
<!--                <ion-card-subtitle>{{ recipe.description }}</ion-card-subtitle>-->
              </ion-card-header>
<!--              <ion-card-content>-->
<!--                <ion-button @click.stop="editRecipe(recipe.id)" color="secondary"-->
<!--                  >Edytuj</ion-button-->
<!--                >-->
<!--                <ion-button @click.stop="deleteRecipe(recipe.id)" color="danger">Usuń</ion-button>-->
<!--              </ion-card-content>-->
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div v-if="!loading && recipes.length === 0" class="empty-message">
        Brak przepisów w tej kategorii 😥
      </div>

<!--      <ion-button expand="full" router-link="/add-recipe" class="add-button" v-if="!loading">-->
<!--        Dodaj Przepis-->
<!--      </ion-button>-->
      <ion-button class="add-button" size="large" router-link="/add-recipe" shape="round" v-if="!loading">
        <ion-icon slot="icon-only" :icon="add()"></ion-icon>
      </ion-button>
<!--      <ion-fab v-if="!loading">-->
<!--        <ion-fab-button router-link="/add-recipe">-->
<!--          <ion-icon :icon="add()"></ion-icon>-->
<!--        </ion-fab-button>-->
<!--      </ion-fab>-->
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
  IonCardContent,
  IonThumbnail, // Dodany import
} from '@ionic/vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { add, arrowForwardOutline } from 'ionicons/icons' // Twoje Pinia store

export default defineComponent({
  name: 'RecipeList',
  methods: {
    arrowForwardOutline() {
      return arrowForwardOutline
    },
    add() {
      return add
    }
  },
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

ion-card-title {
  font-weight: bolder;
  margin-top: 1rem;
}

ion-card-header .nextBtn{
  position: absolute;
  right: 15px;
  top: 15px;
  --background: white;
  --color: var(--ion-color-primary);
}


ion-card img {
  height: 97px;
  object-fit: cover;
  object-position: center;
}

ion-card:hover {
  transform: scale(1.02);
}

.add-button {
  position: fixed;
  right: 1rem;
  bottom: 4rem;
}

.empty-message {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: gray;
}
</style>
