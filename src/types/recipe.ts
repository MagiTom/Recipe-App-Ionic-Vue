export interface Recipe {
  id: number
  title: string
  description: string
  category: number
  image: string | null
  favourite: boolean,
  url: string
}

export interface RecipeDetails extends Recipe {
  ingredients: string
  instructions: string
}

export interface RecipeFilters {
  title: string
  category: number | null
  onlyFavourites: boolean
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
