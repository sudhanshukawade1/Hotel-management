import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export type Role = 'OWNER' | 'MANAGER' | 'RECEPTIONIST';
export const ROLES: Role[] = ['OWNER', 'MANAGER', 'RECEPTIONIST'];

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export interface User {
  id: number;
  email: string;
  role: Role;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const validateToken = async (token: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (
  id: number,
  data: Partial<RegisterData>,
  token: string,
  role: Role
): Promise<User> => {
  if (role !== 'OWNER') {
    throw new Error('Only OWNER can update users');
  }
  const response = await axios.put(
    `${API_URL}/auth/users/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-Role': role,
      },
    }
  );
  return response.data;
};

export const deleteUserById = async (
  id: number,
  token: string,
  role: Role
): Promise<void> => {
  if (role !== 'OWNER') {
    throw new Error('Only OWNER can delete users');
  }
  await axios.delete(`${API_URL}/auth/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-Role': role,
      },
    }
  );
}; 