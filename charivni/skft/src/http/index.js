import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: 10000,
});

$api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default $api;