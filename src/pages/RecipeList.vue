<template>
  <ion-page>
    <ion-content :scroll-events="true" ref="contentRef">
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col class="header" size="12">
            <p>{{ categoryName }}</p>
          </ion-col>
          <ion-col class="search" size="12" size-md="6">
            <ion-searchbar
              :debounce="500"
              v-model="searchQuery"
              @ionInput="handleInput"
              placeholder="Szukaj po tytule"
            />
            <ion-loading :is-open="loading" message="Ładowanie przepisów..." spinner="crescent" />
          </ion-col>
          <ion-col size="12" size-md="6">
            <ion-button
              class="favourite-btn"
              fill="outline"
              shape="round"
              @click="toggleOnlyFavourites"
            >
              <ion-icon class="ion-margin-end" :icon="onlyFavourites ? heart() : heartOutline()" />
              {{ onlyFavourites ? 'Pokaż wszystkie' : 'Pokaż tylko ulubione' }}
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="6" size-md="3" size-lg="2" v-for="recipe in recipes" :key="recipe.id">
            <ion-card @click="goToRecipe(recipe.id)">
              <ion-card-header>
                <ion-button
                  @click.stop.prevent="toggleFavourite(recipe.id, recipe.favourite)"
                  class="heartBtn"
                  shape="round"
                  fill="clear"
                >
                  <ion-icon slot="icon-only" :icon="recipe.favourite ? heart() : heartOutline()" />
                </ion-button>
                <img alt="recipe image" :src="getImageToShow(recipe.image, recipe.url)" />
                <ion-card-title>{{ recipe.title }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div v-if="!loading && recipes.length === 0" class="empty-message">
        Brak przepisów w tej kategorii 😥
      </div>

      <ion-fab>
        <ion-fab-button class="add-button" router-link="/add-recipe" shape="round" v-if="!loading">
          <ion-icon :icon="addIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-infinite-scroll @ionInfinite="handleInfinite" threshold="100px" :disabled="!hasMore">
        <ion-infinite-scroll-content loading-spinner="dots" loading-text="Ładowanie..." />
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { getImageToShow } from '@/utilis/imageUtils.ts'
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading,
  IonPage,
  IonRow,
  IonSearchbar,
  useIonRouter,
} from '@ionic/vue'
import { add, arrowBackOutline, arrowForwardOutline, heart, heartOutline } from 'ionicons/icons'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { useCategoryStore } from '@/stores/categoryStore'

export default defineComponent({
  name: 'RecipeList',
  methods: {
    heartOutline() {
      return heartOutline
    },
    heart() {
      return heart
    },
    arrowBackOutline() {
      return arrowBackOutline
    },
    getImageToShow,
  },
  components: {
    IonLoading,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonIcon,
    IonFabButton,
    IonFab,
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const recipeStore = useRecipeStore()
    const categoryStore = useCategoryStore()
    const router = useIonRouter()
    const recipes = computed(() => recipeStore.recipes)
    const loading = computed(() => recipeStore.loading)
    const hasMore = computed(() => recipeStore.hasMore)
    const searchQuery = ref('')
    const categoryId = ref(Number(props.id))
    const contentRef = ref<HTMLElement | null>(null)

    const onlyFavourites = ref(false)

    const categoryName = computed(() => {
      return categoryStore.categories.find((cat) => cat.id === categoryId.value)?.name ?? 'Przepisy'
    })

    // Pobrane kategorie na starcie (jeśli jeszcze nie są)
    if (categoryStore.categories.length === 0) {
      categoryStore.fetchCategories()
    }

    const toggleOnlyFavourites = async () => {
      onlyFavourites.value = !onlyFavourites.value
      await loadRecipes(true)
    }

    const handleInput = async () => {
      await loadRecipes(true)
    }

    const loadRecipes = async (reset = false) => {
      recipeStore.setFilter('title', searchQuery.value)
      recipeStore.setFilter('category', categoryId.value)
      recipeStore.setFilter('onlyFavourites', onlyFavourites.value)

      await recipeStore.loadPaginatedRecipes(reset)
    }

    const handleInfinite = async (event: CustomEvent) => {
      await loadRecipes(false)
      ;(event.target as HTMLIonInfiniteScrollElement).complete()
    }

    const toggleFavourite = async (recipeId: number, current: boolean) => {
      await recipeStore.toggleFavouriteRecipe(recipeId, !current)
    }

    watch(
      () => props.id,
      (newId) => {
        if (newId) {
          categoryId.value = Number(newId)
          loadRecipes(true)
        }
      },
      { immediate: true },
    )

    const goToRecipe = (id: number) => router.push(`/recipe/${id}`)

    return {
      handleInput,
      recipes,
      loading,
      goToRecipe,
      handleInfinite,
      searchQuery,
      hasMore,
      contentRef,
      arrowForwardOutline,
      toggleFavourite,
      addIcon: add,
      toggleOnlyFavourites,
      onlyFavourites,
      categoryName
    }
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/media.scss';
.search {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.header {
  margin: 2rem 0 1rem 0;
  p {
    font-weight: bolder;
    font-size: 1.5rem;
    text-align: center;
    margin: 0 auto;
  }
}

ion-searchbar {
  --box-shadow: 0;
  border: 1px solid var(--ion-color-light);
  border-radius: 16px;
}

ion-card {
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 16px;
}

ion-card-title {
  font-weight: bolder;
  font-size: 1.2rem;
  margin: 1rem;
}

ion-card-header .heartBtn {
  position: absolute;
  right: 5px;
  top: 5px;
  --background: white;
  --color: var(--ion-color-primary);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

ion-card-header .heartBtn:hover ion-icon {
  color: inherit;
  pointer-events: none;
  cursor: pointer;
}

ion-card img {
  height: 97px;
  object-fit: cover;
  object-position: center;
  @include media(lg) {
    height: 150px;
  }
}

ion-card:hover {
  transform: scale(1.02);
}

.add-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  @include media(md) {
    right: 4rem;
  }
}

.empty-message {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: gray;
}
</style>
