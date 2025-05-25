<template>
  <ion-page>
    <ion-content :scroll-events="true" ref="contentRef">

      <ion-grid>
        <ion-row>
          <ion-col class="header" size="12">
            <p>Przepisy</p>
          </ion-col>
          <ion-col class="search" size="12">
            <ion-searchbar
              :debounce="500"
              v-model="searchQuery"
              @ionInput="handleInput($event)"
              placeholder="Szukaj po tytule"
            />
            <ion-loading :is-open="loading" message="Ładowanie przepisów..." spinner="crescent" />
            <ion-button
              class="favourite-btn"
              fill="outline"
              shape="round"
              @click="toggleOnlyFavourites"
            >
              <ion-icon
                :icon="onlyFavourites ? heart() : heartOutline()"
                slot="start"
              />
              {{ onlyFavourites ? 'Pokaż wszystkie' : 'Pokaż tylko ulubione' }}
            </ion-button>

          </ion-col>
          <ion-col size="6" size-md="4" size-lg="3" v-for="recipe in recipes" :key="recipe.id">
            <ion-card @click="goToRecipe(recipe.id)">
              <ion-card-header>
                <ion-button
                  class="heartBtn"
                  shape="round"
                  fill="clear"
                  @click.stop.prevent="toggleFavourite(recipe.id, recipe.favourite)"
                >
                  <ion-icon slot="icon-only" :icon="recipe.favourite ? heart() : heartOutline()" />
                </ion-button>
                <img
                  alt="recipe image"
                  :src="getImageToShow(recipe.image, recipe.url)"
                />
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
        <ion-fab-button class="add-button"
                          size="large"
                          router-link="/add-recipe"
                          shape="round"
                          v-if="!loading">
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
  IonCardContent,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonIcon, IonFabButton, IonFab
} from '@ionic/vue'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { add, arrowBackOutline, arrowForwardOutline, heart, heartOutline } from 'ionicons/icons'
import { getImageToShow } from '@/utilis/imageUtils.ts'

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
    }, getImageToShow,

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonIcon,
    IonFabButton,
    IonFab
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
    const nextPage = ref(1)
    const hasMore = ref(true)
    const searchQuery = ref('')
    const categoryId = ref(Number(props.id))
    const recipes = ref([])
    const contentRef = ref<HTMLElement | null>(null)

    const onlyFavourites = ref(false)

    const toggleOnlyFavourites = async () => {
      onlyFavourites.value = !onlyFavourites.value
      await loadRecipes(true)
    }

    const handleInput = async (event: any) => {
      // const query = event.target.value.toLowerCase();
      await loadRecipes(true)
    }

    const loadRecipes = async (reset = false) => {
      if (loading.value) return
      loading.value = true

      if (reset) {
        recipes.value = []
        nextPage.value = 1
        hasMore.value = true
      }

      const response = await recipeStore.fetchPaginatedRecipes({
        page: nextPage.value,
        title: searchQuery.value,
        category: categoryId.value,
        onlyFavourites: onlyFavourites.value,
      })

      if (response?.results?.length) {
        recipes.value.push(...response.results)
        nextPage.value++
        hasMore.value = !!response.next
      } else {
        if (!reset) {
          hasMore.value = false
        }
      }

      loading.value = false
    }

    const handleInfinite = async (event: CustomEvent) => {
      console.log('adsfdfs')
      await loadRecipes(false)
      ;(event.target as HTMLIonInfiniteScrollElement).complete()
    }

    const toggleFavourite = async (recipeId: number, current: boolean) => {
      await recipeStore.toggleFavouriteRecipe(recipeId, !current)
      // Odśwież lokalny stan (jeśli trzymasz `recipes.value`)
      const recipe = recipes.value.find((r) => r.id === recipeId)
      if (recipe) {
        recipe.favourite = !current
      }
    }

    watch(
      () => props.id,
      (newId) => {
        if (newId) {
          categoryId.value = Number(newId)
          loadRecipes(true)
        }
      },
      { immediate: true }
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
      IonFabButton,
      IonFab
    }
  },
})
</script>

<style scoped lang="scss">

.search{
  display: flex;
  flex-direction: column;
  gap: .5rem;
  align-items: center;
}

.header{
  margin: 2rem 0 1rem 0;
  p{
    font-weight: bolder;
    font-size: 1.5rem;
    text-align: center;
    margin: 0 auto;
  }
}

ion-searchbar{
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
  margin-top: 1rem;
}

ion-card-header .heartBtn {
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
  bottom: 1rem;
}

.empty-message {
  text-align: center;
  margin-top: 40px;
  font-size: 1.2rem;
  color: gray;
}
</style>
