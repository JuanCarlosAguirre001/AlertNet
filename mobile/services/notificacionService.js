import api from "./api";

export const notificacionService = {
  crearNotificacion: async (data) => {
    const response = await api.post("notificaciones/", data);
    return response.data;
  },

  getNotificaciones: async () => {
    const response = await api.get("notificaciones/");
    return response.data;
  },
};