import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  authStore.initializeAuth()
  const isAuthenticated = !!authStore.token

  if (isAuthenticated && to.name === 'Login') {
    return next({ name: 'Home' })
  }

  if (!isAuthenticated && to.meta.requiresAuth) {
    return next({ name: 'Login' })
  }

  return next()
}
