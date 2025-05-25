import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard } from './guards/authGuard'
import Main from '@/pages/Main.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./pages/Register.vue'),
  },
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: 'home',
        name: 'Home',
        component: () => import('./pages/Home.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: '/category/:id',
        component: () => import('./pages/RecipeList.vue'),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: '/recipe/:id',
        component: () => import('./pages/RecipeDetails.vue'),
        props: true,
        meta: { requiresAuth: true },
      },
      {
        path: '/add-recipe',
        component: () => import('./pages/AddRecipe.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/edit-recipe/:id',
        component: () => import('./pages/EditRecipe.vue'),
        props: true,
        meta: { requiresAuth: true },
      },
    ],
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)

export default router
