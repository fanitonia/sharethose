import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error("VITE_API_URL is required.");
}

let apiUrl: URL;

try {
  apiUrl = new URL(rawApiUrl);
} catch {
  throw new Error("VITE_API_URL must be a valid absolute URL.");
}

if (apiUrl.protocol !== "http:" && apiUrl.protocol !== "https:") {
  throw new Error("VITE_API_URL must use HTTP or HTTPS.");
}

const apiClient = axios.create({
  baseURL: apiUrl.toString(),
  timeout: 10000,
});

export { apiClient };
