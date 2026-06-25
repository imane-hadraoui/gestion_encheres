import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL; // ex: http://localhost:8000/api
const rootURL = baseURL.replace(/\/api\/?$/, ""); // ex: http://localhost:8000

const api = axios.create({
  baseURL,
  withCredentials: true, // envoie les cookies de session
  withXSRFToken: true, // renvoie le header X-XSRF-TOKEN à partir du cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Récupère le cookie CSRF de Sanctum avant toute requête « écriture »
// (login, register, logout, enchérir...).
export const getCsrfCookie = () =>
  axios.get(`${rootURL}/sanctum/csrf-cookie`, { withCredentials: true });

export default api;
