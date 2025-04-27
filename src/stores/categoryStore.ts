import { defineStore } from 'pinia';
import apiClient from '@/interceptors/errorInterceptor';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Array<{ id: number; name: string }>,
  }),

  actions: {
    async fetchCategories() {
      const response = await apiClient.get('/categories/');
      this.categories = response.data;
    },

    async addCategory(name: string) {
      await apiClient.post('/categories/', { name });
    },

    async deleteCategory(categoryId: number) {
      await apiClient.delete(`/categories/${categoryId}/`);
      await this.fetchCategories(); // Odśwież listę po usunięciu
    },
  },
});
