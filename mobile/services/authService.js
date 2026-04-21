import api from './api';


export const authService = {
  // Crear Cuenta (POST)
  register: async (userData) => {
    try {
      const response = await api.post('usuarios/', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Iniciar Sesión (Simulado o vía ViewSet)
  login: async (email, password) => {
    try {
      // Ajusta según si usas JWT o Simple Login en Django
      const response = await api.get(`usuarios/?email=${email}`); 
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};