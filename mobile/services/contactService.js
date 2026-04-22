import api from "./api";

export const contactService = {
  getContactos: async () => {
    try {
      const response = await api.get("contacto/");
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
      console.log("ENVIANDO CONTACTO:", contactData);
      const response = await api.post("contacto/", contactData);
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
      await api.delete(`contactos/${id}/`);
      return true;
    } catch (error) {
      console.log("DELETE CONTACTO ERROR STATUS:", error?.response?.status);
      console.log("DELETE CONTACTO ERROR DATA:", error?.response?.data);
      throw error?.response?.data || error;
    }
  }
};