import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface Payment {
  paymentId?: number;
  id?: number;
  reservationId: number;
  guestName: string;
  amount: number;
  status: string;
  processedBy?: string;
  message?: string;
}

export const processPayment = async (
  reservationId: number,
  token: string,
  email: string,
  role: string
): Promise<Payment> => {
  try {
    const response = await axios.post(
      `${API_URL}/payment-service/payment/process`,
      { reservationId },
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

// Stub for future implementation
export const getPaymentHistory = async (
  token: string,
  email: string,
  role: string
): Promise<Payment[]> => {
  // TODO: Implement when backend endpoint is available
  return [];
};

export const getPaymentDetails = async (
  reservationId: number,
  token: string,
  email: string,
  role: string
): Promise<Payment> => {
  try {
    const response = await axios.get(
      `${API_URL}/payment-service/payment/details/${reservationId}`,
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