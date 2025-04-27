import { defineStore } from 'pinia';
import apiClient from '@/interceptors/errorInterceptor';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Array<{ id: number; title: string; description: string; category: number }>,
    recipeDetails: null as { id: number; title: string; description: string; ingredients: string; instructions: string; category: number } | null,
  }),

  actions: {
    async fetchAllRecipes() {
      const response = await apiClient.get('/recipes/') // Zakładam endpoint dla wszystkich przepisów
      this.recipes = response.data
    },
    async fetchRecipesByCategory(categoryId: number) {
      const response = await apiClient.get(`/recipes/?category=${categoryId}`);
      this.recipes = response.data;
    },

    async fetchRecipeDetails(recipeId: number) {
      const response = await apiClient.get(`/recipes/${recipeId}/`);
      this.recipeDetails = response.data;
      return response.data; // Dodano zwracanie szczegółów przepisu
    },

    async addRecipe(recipeData: { title: string; description: string; ingredients: string; instructions: string; category: number }) {
      const response = await apiClient.post('/recipes/', recipeData);
      this.recipes.push(response.data);
    },

    async deleteRecipe(recipeId: number) {
      await apiClient.delete(`/recipes/${recipeId}/`);
      this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
    },

    async editRecipe(recipeId: number, updatedData: { title: string; description: string; ingredients: string; instructions: string; category: number }) {
      const response = await apiClient.put(`/recipes/${recipeId}/`, updatedData);
      const index = this.recipes.findIndex(recipe => recipe.id === recipeId);
      if (index !== -1) {
        this.recipes[index] = response.data;
      }
    },
  },
});
