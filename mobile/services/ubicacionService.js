import api from "./api";

export const ubicacionService = {
  crearUbicacion: async (data) => {
    const response = await api.post("ubicaciones/", data);
    return response.data;
  },
};