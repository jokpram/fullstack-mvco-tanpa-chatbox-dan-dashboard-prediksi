//AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { User, Session } from '@/types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sessions: Session[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any, type: 'mine' | 'shipping') => Promise<void>;
  refreshUser: () => Promise<void>;
  loadSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      
      if (storedToken) {
        try {
          // Verify token is not expired
          const decoded: any = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setToken(storedToken);
            await fetchUser();
          } else {
            // Token expired, try to refresh
            await refreshToken();
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('access_token');
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
      await loadSessions();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      setToken(response.token);
      await fetchUser();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      localStorage.removeItem('access_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await authService.getSessions();
      setSessions(response.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await authService.revokeSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, role: role as any });
      setToken(response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('access_token', response.token);
      await loadSessions();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setSessions([]);
      localStorage.removeItem('access_token');
    }
  };

  const register = async (data: any, type: 'mine' | 'shipping') => {
    try {
      if (type === 'mine') {
        await authService.registerMine(data);
      } else {
        await authService.registerShipping(data);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        sessions,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        refreshUser,
        loadSessions,
        revokeSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};