import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null as null | { id: string; name: string },
    recipes: [] as Array<{ id: string; title: string; description: string }>,
  }),
  actions: {
    setUser(user: { id: string; name: string }) {
      this.user = user;
    },
    addRecipe(recipe: { id: string; title: string; description: string }) {
      this.recipes.push(recipe);
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});
