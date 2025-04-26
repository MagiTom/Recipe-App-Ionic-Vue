import { defineStore } from 'pinia';
import axios from 'axios';
import { setAuthHeader } from '@/api/auth';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Array<{ id: number; name: string }>,
  }),

  actions: {
    async fetchCategories() {
      setAuthHeader();
      const response = await axios.get('http://localhost:8000/api/categories/');
      this.categories = response.data;
    },

    async addCategory(name: string) {
      setAuthHeader();
      await axios.post('http://localhost:8000/api/categories/', { name });
    },

    async deleteCategory(categoryId: number) {
      setAuthHeader();
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}/`);
      // odśwież listę po usunięciu
      await this.fetchCategories();
    },
  },
});
