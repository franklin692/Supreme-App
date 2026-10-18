import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const formatPrice = (p, period) => {
  if (p == null || p === 0) return "Riservato";
  const base = `€ ${Number(p).toLocaleString("it-IT")}`;
  return period ? `${base}/${period}` : base;
};

export const waLink = (phone) => {
  const clean = (phone || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}`;
};

const MESI = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
export const currentMonthLabel = () => {
  const d = new Date();
  return `${MESI[d.getMonth()]} ${d.getFullYear()}`;
};
