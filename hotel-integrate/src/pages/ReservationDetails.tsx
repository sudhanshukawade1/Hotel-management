import React, { useEffect, useState } from 'react';
import { getReservationDetails, ReservationDetails, getAllReservations, Reservation } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles';

const ReservationDetailsPage: React.FC = () => {
  const { token, user } = useAuth();
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [fullReservation, setFullReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If no token is available, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }

    if (!reservationId) {
      setError('No reservation ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Get all reservations to find the full reservation with email and dates
        const allReservations = await getAllReservations(token);
        const fullReservationData = allReservations.find(r => r.id === Number(reservationId));
        
        if (fullReservationData) {
          setFullReservation(fullReservationData);
        }
        
        // Get the specific reservation details
        const reservationDetails = await getReservationDetails(Number(reservationId), token, user?.role || '');
        setDetails(reservationDetails);
      } catch (err) {
        console.error('Error fetching reservation details:', err);
        setError('Failed to fetch reservation details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token, user, reservationId, navigate]);

  const styles = {
    page: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      background: colors.white,
      borderRadius: '1.25rem',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      padding: spacing.xxl,
      width: '450px',
      maxWidth: '95vw',
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
      overflow: 'hidden',
    },
    decorationTop: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '6px',
      background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: spacing.xl,
      position: 'relative' as 'relative',
      display: 'inline-block',
    },
    titleAfter: {
      content: '""',
      position: 'absolute' as 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '3px',
      background: colors.primary,
    },
    label: {
      color: colors.textSecondary,
      fontWeight: 600,
      fontSize: '0.9rem',
      textAlign: 'left' as 'left',
      marginBottom: spacing.xs,
    },
    value: {
      color: colors.textPrimary,
      fontWeight: 700,
      fontSize: '1.1rem',
      marginBottom: spacing.md,
      textAlign: 'left' as 'left',
      padding: spacing.sm,
      background: colors.backgroundAlt + '60',
      borderRadius: '0.75rem',
      border: `1px solid ${colors.border}`,
    },
    infoSection: {
      marginBottom: spacing.xl,
      padding: spacing.lg,
      textAlign: 'left' as 'left',
    },
    error: {
      color: colors.error,
      margin: `${spacing.md} 0`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: '0.5rem',
      background: `${colors.error}10`,
      textAlign: 'center' as 'center',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    loadingState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: `${spacing.xxl} 0`,
      flexDirection: 'column' as 'column',
      gap: spacing.md,
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: `4px solid ${colors.backgroundAlt}`,
      borderRadius: '50%',
      borderTop: `4px solid ${colors.primary}`,
      animation: 'spin 1s linear infinite',
    },
    backButton: {
      marginTop: spacing.xl,
      padding: `${spacing.sm} ${spacing.lg}`,
      background: 'transparent',
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      borderRadius: '0.75rem',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing.xs,
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.decorationTop}></div>
        <h1 style={styles.title}>
          Reservation Details
          <div style={styles.titleAfter}></div>
        </h1>
        
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
            <div>Loading reservation details...</div>
          </div>
        ) : error ? (
          <>
            <div style={styles.error}>{error}</div>
            <button 
              style={styles.backButton}
              onClick={() => navigate('/reservations')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Reservations
            </button>
          </>
        ) : details && (
          <>
            <div style={styles.infoSection}>
              <div style={styles.label}>Reservation ID</div>
              <div style={styles.value}>#{reservationId}</div>
              
              <div style={styles.label}>Guest Name</div>
              <div style={styles.value}>{details.guestName}</div>
              
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{fullReservation?.guestEmail || 'N/A'}</div>
              
              <div style={styles.label}>Room Number</div>
              <div style={styles.value}>{details.roomNumber}</div>
              
              <div style={styles.label}>Check-in Date</div>
              <div style={styles.value}>{fullReservation ? new Date(fullReservation.checkInDate).toLocaleDateString() : 'N/A'}</div>
              
              <div style={styles.label}>Check-out Date</div>
              <div style={styles.value}>{fullReservation ? new Date(fullReservation.checkOutDate).toLocaleDateString() : 'N/A'}</div>
              
              <div style={styles.label}>Total Price</div>
              <div style={styles.value}>₹{details.Price}</div>
            </div>
            
            <button 
              style={styles.backButton}
              onClick={() => navigate('/reservations')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Reservations
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailsPage; 