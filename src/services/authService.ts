import { LoginDTO, RegisterDTO, AuthResponse, User } from '../types/auth';
import { apiUrl } from '../config/api';
import { httpClient } from './httpClient';

const API_URL = apiUrl('/api/auth');

const normalizeUser = (raw: Record<string, unknown> | null | undefined): User | null => {
  if (!raw) return null;

  const id = raw.id ?? raw.Id;
  const email = raw.email ?? raw.Email;
  const role = raw.role ?? raw.Role;

  if (!id || !email) return null;

  const roleObj = role as Record<string, unknown> | undefined;

  return {
    id: String(id),
    email: String(email),
    firstName: String(raw.firstName ?? raw.FirstName ?? ''),
    lastName: String(raw.lastName ?? raw.LastName ?? ''),
    phoneNumber: (raw.phoneNumber ?? raw.PhoneNumber ?? null) as string | null,
    role: {
      id: Number(roleObj?.id ?? roleObj?.Id ?? 0),
      name: String(roleObj?.name ?? roleObj?.Name ?? 'User'),
      scope: String(roleObj?.scope ?? roleObj?.Scope ?? ''),
      description: String(roleObj?.description ?? roleObj?.Description ?? ''),
      state: String(roleObj?.state ?? roleObj?.State ?? ''),
      users: (roleObj?.users ?? roleObj?.Users ?? []) as unknown[],
      createdAtDateTime: String(roleObj?.createdAtDateTime ?? roleObj?.CreatedAtDateTime ?? ''),
      updatedAtDateTime: String(roleObj?.updatedAtDateTime ?? roleObj?.UpdatedAtDateTime ?? ''),
      idUserCreated: (roleObj?.idUserCreated ?? roleObj?.IdUserCreated ?? null) as number | null,
      idUserUpdated: (roleObj?.idUserUpdated ?? roleObj?.IdUserUpdated ?? null) as number | null,
    },
  };
};

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await httpClient.post(`${API_URL}/login`, credentials);
    const payload = response.data?.data ?? response.data;

    if (payload?.token) {
      localStorage.setItem('auth-token', payload.token);
      const user = normalizeUser(payload.user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return response.data;
  },

  async register(userData: RegisterDTO): Promise<AuthResponse> {
    const response = await httpClient.post(`${API_URL}/register`, userData);
    const payload = response.data?.data ?? response.data;

    if (payload?.token) {
      localStorage.setItem('auth-token', payload.token);
      const user = normalizeUser(payload.user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post(`${API_URL}/logout`);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('auth-token');

      if (!userStr || !token) {
        return null;
      }

      const user = normalizeUser(JSON.parse(userStr));
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token');
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return false;

      await httpClient.get(`${API_URL}/validate`);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  },

  clearSession() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  },
};
