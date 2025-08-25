import axios from 'axios';
import { ENV } from 'lib/env';

export const api = axios.create({
  baseURL: ENV.API_BASE_URL || '/',
  timeout: 15000
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  }
);
