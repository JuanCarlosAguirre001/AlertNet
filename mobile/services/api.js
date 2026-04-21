import axios from 'axios';

// Cambia '192.168.1.XX' por tu IP real
const API_URL = '190.186.40.146:8000/api'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de espera
});

export default api;