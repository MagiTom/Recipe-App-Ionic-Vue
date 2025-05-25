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
    }>,
    recipeDetails: null as {
      id: number
      title: string
      description: string
      ingredients: string
      instructions: string
      category: number
      image: string | null
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

    async fetchPaginatedRecipes({ page = 1, title = '', category = null }: {
      page: number
      title?: string
      category?: number | null
    }) {
      try {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        if (title) params.append('title', title)
        if (category !== null) params.append('category', category.toString())

        const response = await apiClient.get(`/recipes/?${params.toString()}`)
        return response.data // <-- tutaj spodziewamy się paginowanego obiektu { results, next, ... }
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
