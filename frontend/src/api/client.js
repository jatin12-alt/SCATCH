import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('scatch_token');
  const ownerToken = localStorage.getItem('scatch_owner_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (ownerToken) {
    config.headers['x-owner-token'] = ownerToken;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const isOwnerRequest = error.config?.url?.includes('/owner');
      if (isOwnerRequest) {
        toast.error('Owner session expired. Please log in again.');
        localStorage.removeItem('scatch_owner_token');
      } else {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('scatch_token');
      }
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;