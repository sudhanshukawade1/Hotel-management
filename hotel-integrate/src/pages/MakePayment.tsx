import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { processPayment, Payment} from '../services/paymentService';
import { getReservationDetails, ReservationDetails } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';

const MakePayment: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const { token, user } = useAuth();
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payment, setPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!token || !user || !reservationId) return;
    setLoading(true);
    getReservationDetails(Number(reservationId), token, user.role)
      .then(setDetails)
      .catch(() => setError('Failed to fetch reservation details'))
      .finally(() => setLoading(false));
  }, [token, user, reservationId]);

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
    paymentIcon: {
      fontSize: '2.5rem',
      margin: `0 auto ${spacing.md} auto`,
      display: 'block',
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
    infoSection: {
      marginBottom: spacing.xl,
      padding: spacing.lg,
      background: colors.backgroundAlt + '60',
      borderRadius: '1rem',
      boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.05)',
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
      background: colors.white,
      borderRadius: '0.75rem',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      border: `1px solid ${colors.border}`,
    },
    divider: {
      margin: `${spacing.lg} 0`,
      height: '1px',
      background: colors.border,
    },
    totalSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.lg,
      padding: `${spacing.md} ${spacing.lg}`,
      backgroundColor: `${colors.primary}08`,
      borderRadius: '0.75rem',
    },
    totalLabel: {
      color: colors.textPrimary,
      fontWeight: 600,
      fontSize: '1rem',
    },
    totalValue: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    button: {
      marginTop: spacing.xl,
      padding: `${spacing.md} ${spacing.xl}`,
      borderRadius: '0.75rem',
      border: 'none',
      fontWeight: 700,
      fontSize: '1.1rem',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      width: '100%',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
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
    success: {
      color: colors.success,
      margin: `${spacing.md} 0`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: '0.5rem',
      background: `${colors.success}10`,
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
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    paymentSuccess: {
      marginTop: spacing.xl,
      padding: spacing.xl,
      background: `${colors.success}10`,
      borderRadius: '1rem',
      border: `1px solid ${colors.success}30`,
    },
    paymentSuccessIcon: {
      color: colors.success,
      fontSize: '2.5rem',
      marginBottom: spacing.md,
    },
    paymentInfo: {
      background: colors.white,
      borderRadius: '0.75rem',
      padding: spacing.lg,
      marginTop: spacing.lg,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    paymentInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: `${spacing.xs} 0`,
      borderBottom: `1px dashed ${colors.border}`,
      marginBottom: spacing.xs,
    },
    paymentInfoLabel: {
      color: colors.textSecondary,
      fontSize: '0.9rem',
    },
    paymentInfoValue: {
      color: colors.textPrimary,
      fontWeight: 600,
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.decorationTop}></div>
        
        <span role="img" aria-label="payment" style={styles.paymentIcon}>💳</span>
        <h1 style={styles.title}>
          Make Payment
          <div style={styles.titleAfter}></div>
        </h1>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
            <div>Loading reservation details...</div>
          </div>
        ) : details && !payment ? (
          <>
            <div style={styles.infoSection}>
              <div style={styles.label}>Guest Name</div>
              <div style={styles.value}>{details.guestName}</div>
              
              <div style={styles.label}>Room Number</div>
              <div style={styles.value}>{details.roomNumber}</div>
            </div>
              
            <div style={styles.totalSection}>
              <div style={styles.totalLabel}>Total Price</div>
              <div style={styles.totalValue}>₹{details.Price}</div>
            </div>
            
            {canPay ? (
              <button 
                style={styles.button} 
                onClick={handlePayment} 
                disabled={loading}
                className="hover-button"
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Process Payment
                  </>
                )}
              </button>
            ) : (
              <div style={styles.error}>You do not have permission to process payments.</div>
            )}
          </>
        ) : payment && (
          <div style={styles.paymentSuccess}>
            <div style={styles.paymentSuccessIcon}>✅</div>
            <h2 style={{ color: colors.success, marginBottom: spacing.sm }}>Payment Successful</h2>
            <p style={{ color: colors.textSecondary, marginBottom: spacing.lg }}>
              The payment has been processed successfully.
            </p>
            
            <div style={styles.paymentInfo}>
              <div style={styles.paymentInfoRow}>
                <div style={styles.paymentInfoLabel}>Payment ID</div>
                <div style={styles.paymentInfoValue}>#{payment.paymentId || payment.id}</div>
              </div>
              
              <div style={styles.paymentInfoRow}>
                <div style={styles.paymentInfoLabel}>Status</div>
                <div style={styles.paymentInfoValue}>{payment.status}</div>
              </div>
              
              <div style={styles.paymentInfoRow}>
                <div style={styles.paymentInfoLabel}>Amount</div>
                <div style={styles.paymentInfoValue}>₹{payment.amount}</div>
              </div>
              
              <div style={styles.paymentInfoRow}>
                <div style={styles.paymentInfoLabel}>Processed By</div>
                <div style={styles.paymentInfoValue}>{payment.processedBy}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakePayment; 