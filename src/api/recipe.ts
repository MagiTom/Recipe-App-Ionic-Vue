import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchRecipesByCategory = async (categoryId: number) => {
  const response = await axios.get(`${API_URL}/recipes?category=${categoryId}`);
  return response.data;
};

export const fetchRecipeDetails = async (recipeId: number) => {
  const response = await axios.get(`${API_URL}/recipes/${recipeId}`);
  return response.data;
};

export const addNewRecipe = async (recipeData: object) => {
  const response = await axios.post(`${API_URL}/recipes/`, recipeData);
  return response.data;
};
