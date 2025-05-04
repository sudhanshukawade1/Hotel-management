import axios from 'axios';
import { Role } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface InventoryItem {
  id?: number;
  name: string;
  quantity: number;
  category: string;
}

export interface Staff {
  id?: number;
  name: string;
  role: string;
  onDuty: boolean;
}

export const getItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory/public/items`);
    return response.data as InventoryItem[];
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const getStaff = async () => {
  const response = await axios.get(`${API_URL}/inventory/public/staff`);
  return response.data as Staff[];
};

export const addItem = async (item: InventoryItem, token: string, role: Role) => {
  try {
    const response = await axios.post(
      `${API_URL}/inventory/items`,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      }
    );
    return response.data as InventoryItem;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const addStaff = async (staff: Staff, token: string, role: Role) => {
  try {
    const response = await axios.post(
      `${API_URL}/inventory/staff`,
      staff,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      }
    );
    return response.data as Staff;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const updateItem = async (id: number, item: Partial<InventoryItem>, token: string, role: Role) => {
  try {
    const response = await axios.put(
      `${API_URL}/inventory/items/${id}`,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      }
    );
    return response.data as InventoryItem;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const deleteItem = async (id: number, token: string, role: Role) => {
  try {
    await axios.delete(
      `${API_URL}/inventory/items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      }
    );
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const updateStaff = async (id: number, staff: Partial<Staff>, token: string, role: Role) => {
  const response = await axios.put(
    `${API_URL}/inventory/staff/${id}`,
    staff,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-Role': role,
      },
    }
  );
  return response.data as Staff;
};

export const deleteStaff = async (id: number, token: string, role: Role) => {
  await axios.delete(
    `${API_URL}/inventory/staff/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-Role': role,
      },
    }
  );
}; 