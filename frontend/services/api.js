import axios from 'axios';

// Change this to your backend server IP/URL
// For local development: http://localhost:5000 (iOS sim) or http://10.0.2.2:5000 (Android emulator)
const BASE_URL = 'http://192.168.1.13:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch all restaurants with optional filters
 * @param {Object} params - { search, cuisine, open }
 */
export const fetchRestaurants = async (params = {}) => {
  try {
    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    console.error('fetchRestaurants error:', error.message);
    throw error;
  }
};

/**
 * Fetch a single restaurant by ID
 * @param {number} id - Restaurant ID
 */
export const fetchRestaurantById = async (id) => {
  try {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error('fetchRestaurantById error:', error.message);
    throw error;
  }
};

/**
 * Fetch menu items for a restaurant
 * @param {number} restaurantId - Restaurant ID
 * @param {string} category - Optional category filter
 */
export const fetchMenuByRestaurant = async (restaurantId, category = null) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get(`/restaurants/${restaurantId}/menu`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchMenuByRestaurant error:', error.message);
    throw error;
  }
};

/**
 * Fetch all available cuisine types
 */
export const fetchCuisines = async () => {
  try {
    const response = await api.get('/cuisines');
    return response.data;
  } catch (error) {
    console.error('fetchCuisines error:', error.message);
    throw error;
  }
};

export default api;
