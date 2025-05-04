import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, AuthResponse, LoginData, RegisterData } from '../services/authService';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize token from localStorage when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // TODO: You might want to add logic here to fetch user details
      // using the token, if needed
    }
    setIsInitialized(true);
  }, []);

  const login = async (data: LoginData) => {
    const res: AuthResponse = await apiLogin(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const register = async (data: RegisterData) => {
    const res: AuthResponse = await apiRegister(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {isInitialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 