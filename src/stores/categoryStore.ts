import { defineStore } from 'pinia';
import axios from 'axios';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Array<{ id: number; name: string }>,
  }),

  actions: {
    async fetchCategories() {
      const response = await axios.get('http://localhost:8000/api/categories/');
      this.categories = response.data;
    },
  },
});
