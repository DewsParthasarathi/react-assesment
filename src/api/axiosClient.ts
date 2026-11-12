import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const authUser = localStorage.getItem("authUser");
      if (authUser) {
        const parsed = JSON.parse(authUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    let errorMessage = "An unexpected network error occurred.";

    if (error.response) {
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `Request failed with status ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "No response received from the server. Please check your connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage) as Error & { status?: number };
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  },
);

export default axiosClient;
