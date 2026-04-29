import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "usuarioLogueado";

export const contactService = {
  getContactos: async () => {
    try {
      const usuario = await AsyncStorage.getItem(STORAGE_KEY);
      const user = JSON.parse(usuario);

      const response = await api.get(`contactos/?usuario_id=${user.id}`);
      console.log("CONTACTOS OBTENIDOS:", response.data); 
      return response.data;
    } catch (error) {
      console.log("GET CONTACTOS ERROR STATUS:", error?.response?.status);
      console.log("GET CONTACTOS ERROR DATA:", error?.response?.data);
      throw error?.response?.data || error;
    }
  },

  createContacto: async (contactData) => {
    try {
      console.log("ENVIANDO CONTACTO NUEVO:", contactData);
      const response = await api.post("contactos/", contactData);
      console.log("CONTACTO CREADO:", response.data);
      return response.data;
    } catch (error) {
      console.log("CREATE CONTACTO ERROR STATUS:", error?.response?.status);
      console.log("CREATE CONTACTO ERROR DATA:", error?.response?.data);
      throw error?.response?.data || error;
    }
  },

  deleteContacto: async (id) => {
    try {
      const usuario = await AsyncStorage.getItem(STORAGE_KEY);
      const user = JSON.parse(usuario);

      await api.delete(`contactos/${id}/?usuario_id=${user.id}`);
      return true;
    } catch (error) {
      console.log("DELETE CONTACTO ERROR STATUS:", error?.response?.status);
      console.log("DELETE CONTACTO ERROR DATA:", error?.response?.data);
      throw error?.response?.data || error;
    }
  }
};