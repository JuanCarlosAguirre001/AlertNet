import api from './api';

export const alertaService = {
  // Enviar alerta de pánico
  enviarAlerta: async (alertaData) => {
    const response = await api.post('alertas/', alertaData);
    return response.data;
  },

  // Actualizar ubicación en tiempo real
  actualizarUbicacion: async (ubicacionData) => {
    const response = await api.post('ubicaciones/', ubicacionData);
    return response.data;
  }
};