// This file should be moved to the backend directory since it contains server-side code
// Frontend should not directly use MySQL

import api from './api';

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const response = await api.post('/query', { query, params });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Database error:', error);
    return { data: null, error };
  }
};

// Remove all direct database operations from frontend
export const db = {
  // Use API endpoints instead of direct database queries
  async getCars() {
    return api.get('/cars');
  },
  
  async getCar(id: string) {
    return api.get(`/cars/${id}`);
  },
  
  // ... other methods should use API endpoints
};