import { defineStore } from 'pinia'
import apiClient from '@/interceptors/errorInterceptor'

export interface Category {
  id: number
  name: string
  image: string
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
  }),

  actions: {
    async fetchCategories() {
      const { data } = await apiClient.get('/categories/')
      this.categories = data
    },

    async addCategory(name: string, image: File | null) {
      const formData = this.buildFormData(name, image)
      await apiClient.post('/categories/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await this.fetchCategories()
    },

    async deleteCategory(categoryId: number) {
      await apiClient.delete(`/categories/${categoryId}/`)
      await this.fetchCategories()
    },

    async updateCategory(
      categoryId: number,
      { name, image }: { name: string; image: File | null | string },
    ) {
      console.log(image)
      const formData = this.buildFormData(name, image)
      if (image instanceof File) {
        formData.append('image', image)
      } else if (image === null) {
        formData.append('image', '')
      }

      await apiClient.put(`/categories/${categoryId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await this.fetchCategories()
    },

    buildFormData(name: string, image: File | null | string): FormData {
      const formData = new FormData()
      formData.append('name', name)
      if (image) {
        formData.append('image', image)
      }
      return formData
    },
  },
})
