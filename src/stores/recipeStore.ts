import { defineStore } from 'pinia';
import axios from 'axios';
import { setAuthHeader } from '@/api/auth';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Array<{ id: number; title: string; description: string; category: number }>,
    recipeDetails: null as { id: number; title: string; description: string; ingredients: string; instructions: string } | null,
  }),

  actions: {
    async fetchRecipesByCategory(categoryId: number) {
      try {
        setAuthHeader();
        const response = await axios.get(`http://localhost:8000/api/recipes/?category=${categoryId}`);
        this.recipes = response.data;
      } catch (error) {
        console.error('Błąd pobierania przepisów:', error);
        this.recipes = []; // żeby wyczyścić listę, jeśli błąd
      }
    },

    async fetchRecipeDetails(recipeId: number) {
      try {
        setAuthHeader();
        const response = await axios.get(`http://localhost:8000/api/recipes/${recipeId}/`);
        this.recipeDetails = response.data;
      } catch (error) {
        console.error('Błąd pobierania szczegółów przepisu:', error);
        this.recipeDetails = null;
      }
    },

    async addRecipe(recipeData: { title: string; description: string; ingredients: string; instructions: string; category: number }) {
      try {
        setAuthHeader();
        const response = await axios.post('http://localhost:8000/api/recipes/', recipeData);
        this.recipes.push(response.data);
      } catch (error) {
        console.error('Błąd dodawania przepisu:', error);
        throw error; // przerzucamy dalej, żeby można było obsłużyć na ekranie
      }
    },
  },
});
