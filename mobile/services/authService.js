import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "usuarioLogueado";

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('usuario/register/', userData);
      const usuario = response.data;

      console.log("USUARIO REGISTRADO:", usuario);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));

      const verificacion = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("USUARIO GUARDADO DESPUÉS DE REGISTER:", verificacion);

      return usuario;
    } catch (error) {
      console.log("REGISTER ERROR:", error?.response?.data || error.message);
      throw error?.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.get('usuario/');
      const usuarios = response.data;

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.password === password
      );

      if (!usuarioEncontrado) {
        throw { message: "Correo o contraseña incorrectos" };
      }

      console.log("USUARIO LOGIN:", usuarioEncontrado);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioEncontrado));

      const verificacion = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("USUARIO GUARDADO DESPUÉS DE LOGIN:", verificacion);

      return usuarioEncontrado;
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