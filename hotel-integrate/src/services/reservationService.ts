import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface Room {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  available: boolean;
}

export interface Reservation {
  id: number;
  guestName: string;
  guestEmail: string;
  roomId: number;
  checkInDate: string; // ISO string
  checkOutDate: string; // ISO string
}

export interface ReservationDetails {
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  Price: number;
  checkInDate: string;
  checkOutDate: string;
}

export const fetchAvailableRooms = async (checkIn: string, checkOut: string): Promise<Room[]> => {
  try {
    const response = await axios.get(`${API_URL}/reservation-service/public/rooms/available`, {
      params: { checkIn, checkOut },
    });
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const bookRoom = async (
  data: Omit<Reservation, 'id'>,
  token: string,
  email: string,
  role: string
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/reservation-service/reservation/book`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Email': email,
          'X-User-Role': role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const getAllReservations = async (token: string): Promise<Reservation[]> => {
  try {
    const response = await axios.get(`${API_URL}/reservation-service/reservation/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const getReservationDetails = async (
  reservationId: number,
  token: string,
  role: string
): Promise<ReservationDetails> => {
  try {
    const response = await axios.get(
      `${API_URL}/reservation-service/reservation/details/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-User-Role': role,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const updateReservation = async (
  id: number,
  data: Partial<Reservation>,
  token: string
): Promise<Reservation> => {
  try {
    const response = await axios.put(
      `${API_URL}/reservation-service/reservation/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const deleteReservation = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/reservation-service/reservation/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
};

export const getAllRooms = async (): Promise<Room[]> => {
  try {
    const response = await axios.get(`${API_URL}/reservation-service/rooms/all`);
    return response.data;
  } catch (error: any) {
    const backendMsg = error.response?.data?.error || error.message || 'Unknown error';
    throw new Error(backendMsg);
  }
}; 