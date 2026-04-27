import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "usuarioLogueado";

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post("usuario/register/", userData);
      const usuario = response.data.user;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));

      console.log("USUARIO GUARDADO DESPUÉS DE REGISTER:", usuario);

      return response.data;
    } catch (error) {
      console.log("REGISTER ERROR:", error?.response?.data || error.message);
      throw error?.response?.data || error;
    }
  },

  login: async (correo, password) => {
    try {
      const response = await api.post("usuario/login/", {
        correo,
        password,
      });

      const usuario = response.data.user;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));

      console.log("USUARIO GUARDADO DESPUÉS DE LOGIN:", usuario);

      return response.data;
    } catch (error) {
      console.log("LOGIN ERROR:", error?.response?.data || error.message);
      throw error?.response?.data || error;
    }
  },

  getCurrentUser: async () => {
    try {
      const usuario = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("USUARIO LEÍDO DEL STORAGE:", usuario);
      return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
      console.log("GET CURRENT USER ERROR:", error);
      return null;
    }
  },

  clearCurrentUser: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
};