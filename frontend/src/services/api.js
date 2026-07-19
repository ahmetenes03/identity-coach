import axios from "axios";

// Tek doğruluk kaynağı: token anahtarı burada tanımlanır, authService da
// buradan import eder (iki kopya sessizce ayrışamaz).
export const TOKEN_KEY = "identity_coach_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Axios hatasından kullanıcıya gösterilecek mesajı çıkarır.
 * FastAPI `detail` alanı string olabilir (400/404/409) ya da 422'de
 * obje listesi olabilir — her iki şekli de düzgün ele alır.
 */
export const getApiErrorMessage = (error, fallback) => {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return first.msg;
  }
  return fallback;
};

export default api;
