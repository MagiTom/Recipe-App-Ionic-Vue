import { defineStore } from 'pinia';
import apiClient from '@/interceptors/errorInterceptor';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Array<{ id: number; name: string, image: string }>,
  }),

  actions: {
    async fetchCategories() {
      const response = await apiClient.get('/categories/');
      this.categories = response.data;
    },
    async addCategory(name: string, image: File | null ) {
      const formData = new FormData();
      formData.append('name', name);
      if (image) {
        formData.append('image', image);
      }

      await apiClient.post('/categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await this.fetchCategories(); // Dodaj, jeśli chcesz od razu zaktualizować listę
    },

    async deleteCategory(categoryId: number) {
      await apiClient.delete(`/categories/${categoryId}/`);
      await this.fetchCategories(); // Odśwież listę po usunięciu
    },

    async updateCategory(categoryId: number, categoryData: { name: string; image: File | null }) {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      await apiClient.put(`/categories/${categoryId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await this.fetchCategories();
    },
  },
});
