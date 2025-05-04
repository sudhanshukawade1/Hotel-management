import React, { useEffect, useState } from 'react';
import { getReservationDetails, ReservationDetails } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { colors, spacing } from '../styles';

const ReservationDetailsPage: React.FC = () => {
  const { token, user } = useAuth();
  const { reservationId } = useParams<{ reservationId: string }>();
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user || !reservationId) return;
    setLoading(true);
    getReservationDetails(Number(reservationId), token, user.role)
      .then(setDetails)
      .catch(() => setError('Failed to fetch reservation details'))
      .finally(() => setLoading(false));
  }, [token, user, reservationId]);

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
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>Reservation Details</div>
        {loading && <div>Loading...</div>}
        {error && <div style={styles.error}>{error}</div>}
        {details && !loading && !error && (
          <>
            <div style={styles.label}>Guest Name</div>
            <div style={styles.value}>{details.guestName}</div>
            <div style={styles.label}>Room Number</div>
            <div style={styles.value}>{details.roomNumber}</div>
            <div style={styles.label}>Total Price</div>
            <div style={styles.value}>₹{details.Price}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailsPage; 