<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Przepisy</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-events="true" ref="contentRef">
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Szukaj po tytule"
      />
      <ion-loading :is-open="loading" message="Ładowanie przepisów..." spinner="crescent" />

      <ion-grid>
        <ion-row>
          <ion-col size="6" size-md="4" size-lg="3" v-for="recipe in recipes" :key="recipe.id">
            <ion-card @click="goToRecipe(recipe.id)">
              <ion-card-header>
                <ion-button class="nextBtn" shape="round">
                  <ion-icon slot="icon-only" :icon="arrowForwardOutline" />
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

      <ion-button
        class="add-button"
        size="large"
        router-link="/add-recipe"
        shape="round"
        v-if="!loading"
      >
        <ion-icon slot="icon-only" :icon="addIcon" />
      </ion-button>

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
  IonIcon,
} from '@ionic/vue'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useRecipeStore } from '../stores/recipeStore'
import { add, arrowForwardOutline } from 'ionicons/icons'
import { getImageToShow } from '@/utilis/imageUtils.ts'

export default defineComponent({
  name: 'RecipeList',
  methods: { getImageToShow },
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

    let debounceTimer: ReturnType<typeof setTimeout> | null = null

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

    watch(searchQuery, () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(async () => {
        await loadRecipes(true)
      }, 500)
    })

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
      recipes,
      loading,
      goToRecipe,
      handleInfinite,
      searchQuery,
      hasMore,
      contentRef,
      arrowForwardOutline,
      addIcon: add,
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

ion-card-header .nextBtn {
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
