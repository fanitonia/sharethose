import axios from "axios";

const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL,
};

const apiClient = axios.create(apiConfig);

export { apiClient };
