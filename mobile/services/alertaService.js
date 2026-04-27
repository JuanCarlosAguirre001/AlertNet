import api from "./api";

export const alertaService = {
  crearAlerta: async (data) => {
    const response = await api.post("alertas/", data);
    return response.data;
  },

  finalizarAlerta: async (id) => {
    const response = await api.patch(`alertas/${id}/`, {
      estado: "finalizada",
    });
    return response.data;
  },
};