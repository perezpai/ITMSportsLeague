import axios from 'axios';

// URL base de la API. En desarrollo apunta a la API local por defecto;
// en producción se define con la variable de entorno VITE_API_URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7169/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const TOKEN_STORAGE_KEY = 'sportsleague.token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipo de error normalizado que exponemos a la UI, sin importar si vino
// del middleware de excepciones del backend, de ModelState (400) o de axios.
export interface ApiError {
  status?: number;
  message: string;
  errors?: string[];
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data) {
      if (typeof data === 'string') {
        return { status: error.response?.status, message: data };
      }
      if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
        // Errores de ModelState de ASP.NET Core: { errors: { Campo: ["mensaje"] } }
        const messages = Object.values(data.errors).flat() as string[];
        return { status: error.response?.status, message: messages[0] ?? 'Solicitud inválida', errors: messages };
      }
      if (data.message) {
        return { status: error.response?.status, message: data.message, errors: data.errors };
      }
    }
    if (error.response?.status === 401) {
      return { status: 401, message: 'Debes iniciar sesión para continuar' };
    }
    if (error.response?.status === 403) {
      return { status: 403, message: 'No tienes permisos para realizar esta acción' };
    }
    if (error.code === 'ERR_NETWORK') {
      return { message: 'No se pudo conectar con la API. Verifica que esté corriendo.' };
    }
    return { status: error.response?.status, message: error.message };
  }
  return { message: 'Ocurrió un error inesperado' };
}
