//auth.service.ts
import api from './api';
import { LoginCredentials, RegisterCredentials, User, Session } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem('access_token', token);
    }
    return response.data;
  },

  async registerMine(credentials: RegisterCredentials) {
    return api.post('/auth/register/mine', credentials);
  },

  async registerShipping(credentials: RegisterCredentials) {
    return api.post('/auth/register/shipping', credentials);
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    const token = response.data.token;
    if (token) {
      localStorage.setItem('access_token', token);
    }
    return response.data;
  },

  async getSessions(): Promise<{ sessions: Session[] }> {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  async revokeSession(sessionId: string) {
    return api.delete(`/auth/sessions/${sessionId}`);
  }
};