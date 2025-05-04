import React, { useState } from 'react';
import { processPayment, Payment } from '../services/paymentService';
import { getReservationDetails, ReservationDetails } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';

const MakePaymentGeneric: React.FC = () => {
  const { token, user } = useAuth();
  const [reservationId, setReservationId] = useState('');
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payment, setPayment] = useState<Payment | null>(null);

  const handleFetchDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setDetails(null);
    setPayment(null);
    try {
      const res = await getReservationDetails(Number(reservationId), token!, user!.role);
      setDetails(res);
    } catch {
      setError('Failed to fetch reservation details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!token || !user || !reservationId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await processPayment(Number(reservationId), token, user.email, user.role);
      setPayment({
        ...result,
        processedBy: result.message?.replace('Payment processed by ', '') || result.processedBy,
      });
      setSuccess('Payment processed successfully!');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Payment already processed');
    } finally {
      setLoading(false);
    }
  };

  const canPay = user && ['OWNER', 'MANAGER', 'RECEPTIONIST'].includes(user.role);

  const styles = {
    page: {
      minHeight: '100vh',
      background: `linear-gradient(120deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    card: {
      background: colors.white,
      borderRadius: '1.5rem',
      boxShadow: '0 10px 32px rgba(0,0,0,0.10)',
      padding: spacing.xxl,
      minWidth: '340px',
      maxWidth: '95vw',
      textAlign: 'center' as 'center',
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: spacing.lg,
    },
    form: {
      display: 'flex',
      gap: spacing.md,
      marginBottom: spacing.lg,
      justifyContent: 'center',
      flexWrap: 'wrap' as 'wrap',
    },
    input: {
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      minWidth: '160px',
    },
    button: {
      padding: `${spacing.md} ${spacing.xl}`,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(15,23,42,0.12)',
      transition: 'all 0.2s',
    },
    label: {
      color: colors.textSecondary,
      fontWeight: 600,
      fontSize: '1rem',
      marginTop: spacing.md,
    },
    value: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.2rem',
      marginBottom: spacing.md,
    },
    error: {
      color: colors.error,
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
    success: {
      color: colors.success,
      marginBottom: spacing.md,
      textAlign: 'center' as 'center',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Make Payment</div>
        <form style={styles.form} onSubmit={handleFetchDetails}>
          <input
            style={styles.input}
            type="number"
            placeholder="Enter Reservation ID"
            value={reservationId}
            onChange={e => setReservationId(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Details'}
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        {details && !payment && (
          <>
            <div style={styles.label}>Guest Name</div>
            <div style={styles.value}>{details.guestName}</div>
            <div style={styles.label}>Room Number</div>
            <div style={styles.value}>{details.roomNumber}</div>
            <div style={styles.label}>Total Price</div>
            <div style={styles.value}>₹{details.Price}</div>
            {canPay ? (
              <button style={styles.button} onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            ) : (
              <div style={styles.error}>You do not have permission to process payments.</div>
            )}
          </>
        )}
        {payment && (
          <>
            <div style={styles.label}>Payment ID</div>
            <div style={styles.value}>{payment.paymentId || payment.id}</div>
            <div style={styles.label}>Status</div>
            <div style={styles.value}>{payment.status}</div>
            <div style={styles.label}>Amount</div>
            <div style={styles.value}>₹{payment.amount}</div>
            <div style={styles.label}>Processed By</div>
            <div style={styles.value}>{payment.processedBy}</div>
            <div style={styles.success}>{`Payment processed by ${payment.processedBy}`}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MakePaymentGeneric; 