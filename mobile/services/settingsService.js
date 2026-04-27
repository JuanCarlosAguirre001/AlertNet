import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "usuarioLogueado";

export const settingsService = {
  getConfiguracion: async () => {
    const usuario = await AsyncStorage.getItem(STORAGE_KEY);
    const user = JSON.parse(usuario);

    const response = await api.get(`configuracion/?usuario_id=${user.id}`);
    return response.data;
  },

  updateConfiguracion: async (configData) => {
    const usuario = await AsyncStorage.getItem(STORAGE_KEY);
    const user = JSON.parse(usuario);

    const response = await api.put("configuracion/", {
      usuario_id: user.id,
      ...configData,
    });

    return response.data;
  },
};