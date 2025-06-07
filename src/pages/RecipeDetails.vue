<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-if="recipe" class="recipe">
        <div class="recipe__image-wrapper">
          <div class="recipe__actions">
            <ion-button
              @click="editRecipe(recipe.id)"
              color="secondary"
              class="recipe__action"
              shape="round"
            >
              <ion-icon slot="icon-only" :icon="createOutline()"></ion-icon>
            </ion-button>
            <ion-button
              @click="deleteRecipe(recipe.id)"
              color="secondary"
              class="recipe__action"
              shape="round"
            >
              <ion-icon slot="icon-only" :icon="trashOutline()"></ion-icon>
            </ion-button>
          </div>
          <img class="recipe__image" :src="imageToShow" alt="recipe image" />
        </div>

        <div class="recipe__content">
          <ion-grid>
            <ion-row>
              <ion-col size="12">
                <h3 class="recipe__title">{{ recipe.title }}</h3>
              </ion-col>
              <ion-col size="12">
                <div class="recipe__web">
                  <ion-badge color="secondary">
                    <ion-icon size="large" :icon="globeOutline()" />
                  </ion-badge>
                  <h4 class="recipe__subtitle">Strona</h4>
                </div>
                <a :href="recipe.url" class="recipe__description">{{ recipe.url }}</a>
              </ion-col>
              <ion-col size="12">
                <div v-if="ingredientsList.length">
                  <h4 class="recipe__subtitle">Składniki</h4>
                  <p class="recipe__description">{{ ingredientsList.length }} elementów</p>
                  <div class="recipe__ingredients">
                    <ion-badge
                      color="secondary"
                      v-for="(ingredient, index) in ingredientsList"
                      :key="index"
                    >
                      {{ ingredient }}</ion-badge
                    >
                  </div>
                </div>
              </ion-col>
              <ion-col size="12">
                <div v-if="recipe.instructions">
                  <h4 class="recipe__subtitle">Instrukcje</h4>
                  <p class="recipe__description">{{ recipe.instructions }}</p>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
      <div v-else>
        <div class="ion-text-center">
          <ion-spinner name="dots"></ion-spinner>
          <p>Ładowanie przepisu...</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { useRecipeStore } from '@/stores/recipeStore'
import { getImageToShow } from '@/utilis/imageUtils.ts'
import {
  alertController,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonSpinner,
  onIonViewWillEnter,
  useIonRouter,
} from '@ionic/vue'
import { createOutline, globeOutline, trashOutline } from 'ionicons/icons'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'RecipeDetails',
  methods: {
    globeOutline() {
      return globeOutline
    },
    trashOutline() {
      return trashOutline
    },
    createOutline() {
      return createOutline
    },
  },
  components: {
    IonButton,
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
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

    onIonViewWillEnter(() => {
      recipeStore.fetchRecipeDetails(Number(props.id))
    })

    const recipe = computed(() => recipeStore.recipeDetails)

    const ingredientsList = computed(() => {
      if (!recipe.value || typeof recipe.value.ingredients !== 'string') return []
      return recipe.value.ingredients.split(',').map((item) => item.trim())
    })

    const deleteRecipe = async (recipeId: number) => {
      const alert = await alertController.create({
        header: 'Potwierdzenie',
        message: 'Czy na pewno chcesz usunąć ten przepis?',
        buttons: [
          {
            text: 'Anuluj',
            role: 'cancel',
          },
          {
            text: 'Usuń',
            role: 'confirm',
            handler: async () => {
              await recipeStore.deleteRecipe(recipeId)
              router.back()
            },
          },
        ],
      })
      await alert.present()
    }

    const editRecipe = (recipeId: number) => {
      router.push(`/edit-recipe/${recipeId}`)
    }

    const imageToShow = computed(() =>
      getImageToShow(recipe.value?.image ?? null, recipe.value?.url ?? null),
    )

    return {
      recipe,
      ingredientsList,
      deleteRecipe,
      editRecipe,
      imageToShow,
    }
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/media.scss';
.recipe {
    @include media(md) {
    width: 70%;
    margin: 0 auto;
  }
  &__image-wrapper {
    width: 100%;
    height: 250px;
    overflow: hidden;
    position: relative;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__actions {
    position: absolute;
    right: 1rem;
    top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__web {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__content {
    background: white;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    margin-top: -40px;
    padding: 1rem;
    position: relative;
    z-index: 1;
  }

  &__title {
    font-weight: bold;
    margin-top: 0;
  }
  &__subtitle {
    font-weight: bold;
  }
  &__description {
    margin-block: 0.5rem;
    color: var(--ion-color-medium);
  }

  &__ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
