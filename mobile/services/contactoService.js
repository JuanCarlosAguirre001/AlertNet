import api from './api';

export const contactoService = {
  // Obtener contactos de un usuario
  getContactos: async (usuarioId) => {
    const response = await api.get(`contactos/?usuario=${usuarioId}`);
    return response.data;
  },

  // Añadir nuevo contacto
  createContacto: async (contactoData) => {
    const response = await api.post('contactos/', contactoData);
    return response.data;
  },

  // Eliminar contacto
  deleteContacto: async (id) => {
    await api.delete(`contactos/${id}/`);
  }
};