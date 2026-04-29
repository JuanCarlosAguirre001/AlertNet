import axios from "axios";

const api = axios.create({
  baseURL: "http://3.150.160.101:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;