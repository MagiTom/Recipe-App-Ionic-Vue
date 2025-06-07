import { defineStore } from 'pinia'
import apiClient from '@/interceptors/errorInterceptor'
import type { Recipe, RecipeDetails, RecipeFilters, PaginatedResponse } from '@/types/recipe'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[],
    currentPage: 1,
    hasMore: true,
    loading: false,
    filters: {
      title: '',
      category: null,
      onlyFavourites: false,
    } as RecipeFilters,
    recipeDetails: null as RecipeDetails | null,
  }),

  actions: {
    async fetchAllRecipes() {
      const { data } = await apiClient.get<Recipe[]>('/recipes/')
      this.recipes = data
    },

    async fetchRecipesByCategory(categoryId: number) {
      const { data } = await apiClient.get<Recipe[]>(`/recipes/?category=${categoryId}`)
      this.recipes = data
    },

    async fetchFavouriteRecipes() {
      const { data } = await apiClient.get<Recipe[]>('/recipes/?favourite=true')
      this.recipes = data
    },

    async toggleFavouriteRecipe(recipeId: number, favourite: boolean) {
      const { data } = await apiClient.patch<{ data: Recipe }>(`/recipes/${recipeId}/`, { favourite })

      const index = this.recipes.findIndex((recipe) => recipe.id === recipeId)
      if (index !== -1) {
        this.recipes[index] = data.data
      }

      return data
    },

    async fetchRecipeDetails(recipeId: number) {
      const { data } = await apiClient.get<RecipeDetails>(`/recipes/${recipeId}/`)
      this.recipeDetails = data
      return data
    },

    async addRecipe(formData: FormData) {
      const { data } = await apiClient.post<{ data: Recipe }>('/recipes/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      this.recipes.push(data.data)
    },

    async deleteRecipe(recipeId: number) {
      await apiClient.delete(`/recipes/${recipeId}/`)
      this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId)
    },

    async editRecipe(recipeId: number, updatedData: FormData) {
      const { data } = await apiClient.put<{ data: Recipe }>(`/recipes/${recipeId}/`, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const index = this.recipes.findIndex((recipe) => recipe.id === recipeId)
      if (index !== -1) {
        this.recipes[index] = data.data
      }
    },

    async loadPaginatedRecipes(reset = false) {
      if (this.loading) return
      this.loading = true

      if (reset) {
        this.recipes = []
        this.currentPage = 1
        this.hasMore = true
      }

      const params = new URLSearchParams()
      params.append('page', this.currentPage.toString())
      if (this.filters.title) params.append('title', this.filters.title)
      if (this.filters.category !== null) params.append('category', this.filters.category.toString())
      if (this.filters.onlyFavourites) params.append('favourite', 'true')

      const { data } = await apiClient.get<PaginatedResponse<Recipe>>(`/recipes/?${params.toString()}`)
      if (data.results.length) {
        this.recipes.push(...data.results)
        this.currentPage++
        this.hasMore = !!data.next
      } else {
        this.hasMore = false
      }

      this.loading = false
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
      const params = new URLSearchParams()
      params.append('page', page.toString())
      if (title) params.append('title', title)
      if (category !== null) params.append('category', category.toString())
      if (onlyFavourites) params.append('favourite', 'true')

      const { data } = await apiClient.get<PaginatedResponse<Recipe>>(`/recipes/?${params.toString()}`)
      return data
    },

    setFilter(filterName: keyof RecipeFilters, value: any) {
      this.filters[filterName] = value
    },
  },
})
