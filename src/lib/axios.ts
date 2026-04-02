import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Module-level reference to Clerk's getToken — set once from the admin layout
let _getToken: (() => Promise<string | null>) | null = null;

export function setGetTokenFn(fn: () => Promise<string | null>) {
  _getToken = fn;
}

// Automatically attach Bearer token to every request if available
api.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // silently skip — request goes out without token
    }
  }
  return config;
});

export default api;

