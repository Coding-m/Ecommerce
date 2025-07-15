import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8080/api',
  //  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  let token = auth?.jwtToken;
  if (token?.includes("=")) token = token.split("=")[1].split(";")[0];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
