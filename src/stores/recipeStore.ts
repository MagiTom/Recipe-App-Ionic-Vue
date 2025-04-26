import { defineStore } from 'pinia';
import axios from 'axios';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Array<{ id: number; title: string; description: string; category: number }>,
    recipeDetails: null as { id: number; title: string; description: string; ingredients: string; instructions: string } | null,
  }),

  actions: {
    async fetchRecipesByCategory(categoryId: number) {
      const response = await axios.get(`http://localhost:8000/api/recipes?category=${categoryId}`);
      this.recipes = response.data;
    },

    async fetchRecipeDetails(recipeId: number) {
      const response = await axios.get(`http://localhost:8000/api/recipes/${recipeId}`);
      this.recipeDetails = response.data;
    },

    async addRecipe(recipeData: { title: string; description: string; ingredients: string; instructions: string; category: number }) {
      const response = await axios.post('http://localhost:8000/api/recipes/', recipeData);
      this.recipes.push(response.data);
    },
  },
});
