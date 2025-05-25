import { defineStore } from 'pinia'
import apiClient from '@/interceptors/errorInterceptor'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Array<{
      id: number
      title: string
      description: string
      category: number
      image: string | null
      favourite: boolean
    }>,
    recipeDetails: null as {
      id: number
      title: string
      description: string
      ingredients: string
      instructions: string
      category: number
      image: string | null
      favourite: boolean
    } | null,
  }),

  actions: {
    async fetchAllRecipes() {
      const response = await apiClient.get('/recipes/') // Zakładam endpoint dla wszystkich przepisów
      this.recipes = response.data
    },
    async fetchRecipesByCategory(categoryId: number) {
      const response = await apiClient.get(`/recipes/?category=${categoryId}`)
      this.recipes = response.data
    },

    async toggleFavouriteRecipe(recipeId: number, favourite: boolean) {
      try {
        const response = await apiClient.patch(`/recipes/${recipeId}/`, { favourite })

        const index = this.recipes.findIndex((r) => r.id === recipeId)
        if (index !== -1) {
          this.recipes[index].favourite = response.data.favourite
        }

        if (this.recipeDetails?.id === recipeId) {
          this.recipeDetails.favourite = response.data.favourite
        }

        return response.data
      } catch (error) {
        console.error('Błąd podczas zmiany ulubionego przepisu:', error)
      }
    },

    async fetchFavouriteRecipes() {
      try {
        const response = await apiClient.get('/recipes/?favourite=true')
        this.recipes = response.data
      } catch (error) {
        console.error('Błąd podczas ładowania ulubionych przepisów:', error)
      }
    },

    async fetchPaginatedRecipes({
                                  page = 1,
                                  title = '',
                                  category = null,
                                  onlyFavourites = false,
                                }: {
      page: number
      title?: string
      category?: number | null
      onlyFavourites?: boolean
    }) {
      try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        if (title) params.append('title', title)
        if (category !== null) params.append('category', category.toString())
        if (onlyFavourites) params.append('favourite', 'true')

        const response = await apiClient.get(`/recipes/?${params.toString()}`)
        return response.data
      } catch (error) {
        console.error('Błąd podczas ładowania przepisów:', error)
        return { results: [], next: null }
      }
    },


    async fetchRecipeDetails(recipeId: number) {
      const response = await apiClient.get(`/recipes/${recipeId}/`)
      this.recipeDetails = response.data
      return response.data // Dodano zwracanie szczegółów przepisu
    },

    async addRecipe(formData: FormData) {
      const response = await apiClient.post('/recipes/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      this.recipes.push(response.data)
    },

    async deleteRecipe(recipeId: number) {
      await apiClient.delete(`/recipes/${recipeId}/`)
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)
    },

    async editRecipe(recipeId: number, updatedData: FormData) {
      const response = await apiClient.put(`/recipes/${recipeId}/`, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const index = this.recipes.findIndex((recipe) => recipe.id === recipeId)
      if (index !== -1) {
        this.recipes[index] = response.data.data
      }
    },
  },
})
