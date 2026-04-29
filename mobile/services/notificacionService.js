import api from "./api";
import { useState, useEffect, useRef } from 'react';


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


const WS_URL = 'ws://172.27.224.1:8000/ws/notificaciones';


export const useNotificationSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // 1. Inicializar conexión
    socket.current = new WebSocket(`${WS_URL}/${userId}/`);

    socket.current.onopen = () => {
      console.log('✅ Socket Conectado');
      setIsConnected(true);
    };

    socket.current.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data);

      if (type === 'historial_notificaciones') {
        // Guardamos el array completo inicial
        setNotifications(payload);
      } 
      
      if (type === 'nueva_notificacion') {
        // Insertamos el nuevo objeto al inicio del array existente
        setNotifications((prev) => [payload, ...prev]);
      }
    };

    socket.current.onerror = (err) => console.error('❌ Error Socket:', err);
    
    socket.current.onclose = () => {
      console.log('🔌 Socket Desconectado');
      setIsConnected(false);
    };

    // 2. Limpieza automática al cerrar la pantalla/app
    return () => {
      socket.current?.close();
    };
  }, [userId]);

  // Exponemos lo que la UI necesita
  return { notifications, setNotifications, isConnected };
};