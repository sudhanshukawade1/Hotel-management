import React, { useEffect, useState } from 'react';
import { getAllReservations, Reservation, deleteReservation } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';
import { useNavigate } from 'react-router-dom';

const Reservations: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllReservations(token)
      .then(setReservations)
      .catch(() => setError('Failed to load reservations'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteReservation(id, token);
      setReservations(reservations.filter(r => r.id !== id));
      setSuccess('Reservation deleted successfully!');
      setConfirmDeleteId(null);
    } catch {
      setError('Failed to delete reservation');
    }
  };

  const filtered = reservations.filter(r =>
    r.guestName.toLowerCase().includes(search.toLowerCase()) ||
    r.guestEmail.toLowerCase().includes(search.toLowerCase())
  );

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
    container: {
      width: '1100px',
      maxWidth: '98vw',
      background: colors.white,
      borderRadius: '1.25rem',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      padding: spacing.xxl,
      margin: 'auto',
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
    header: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '2.25rem',
      marginBottom: spacing.sm,
      position: 'relative' as 'relative',
      display: 'inline-block',
    },
    titleAfter: {
      content: '""',
      position: 'absolute' as 'absolute',
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '3px',
      background: colors.primary,
    },
    searchContainer: {
      width: '100%',
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
      position: 'relative' as 'relative',
    },
    searchIcon: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: spacing.md,
      transform: 'translateY(-50%)',
      color: colors.textSecondary,
    },
    search: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing.xxl}`,
      borderRadius: '0.75rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      transition: 'all 0.25s ease',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      outline: 'none',
    },
    searchFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}20`,
    },
    table: {
      width: '100%',
      borderCollapse: 'separate' as 'separate',
      borderSpacing: '0 12px',
      marginBottom: spacing.lg,
    },
    tableContainer: {
      overflow: 'auto' as 'auto',
      maxWidth: '100%',
      borderRadius: '0.75rem',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.03)',
      padding: spacing.sm,
      background: colors.backgroundAlt + '50',
    },
    th: {
      textAlign: 'left' as 'left',
      padding: `${spacing.md} ${spacing.md}`,
      color: colors.textSecondary,
      fontWeight: 600,
      fontSize: '0.85rem',
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '0.05em',
      position: 'relative' as 'relative',
      paddingBottom: `calc(${spacing.md} + 8px)`,
    },
    thAfter: {
      content: '""',
      position: 'absolute' as 'absolute',
      bottom: 0,
      left: spacing.md,
      right: spacing.md,
      height: '2px',
      background: `${colors.border}`,
    },
    tr: {
      background: colors.white,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      borderRadius: '0.75rem',
      transition: 'all 0.25s',
      marginBottom: spacing.md,
    },
    trHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.08)',
    },
    td: {
      padding: spacing.md,
      color: colors.textPrimary,
      fontSize: '0.95rem',
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      borderSpacing: spacing.md,
    },
    tdFirst: {
      borderLeft: `1px solid ${colors.border}`,
      borderTopLeftRadius: '0.75rem',
      borderBottomLeftRadius: '0.75rem',
    },
    tdLast: {
      borderRight: `1px solid ${colors.border}`,
      borderTopRightRadius: '0.75rem',
      borderBottomRightRadius: '0.75rem',
    },
    actionBtn: {
      marginRight: spacing.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.primary,
      color: colors.white,
      transition: 'all 0.25s',
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing.xs,
    },
    actionBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    deleteBtn: {
      background: colors.error,
    },
    paymentBtn: {
      background: colors.success,
    },
    confirmDialog: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out',
    },
    confirmBox: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      padding: spacing.xxl,
      minWidth: '380px',
      textAlign: 'center' as 'center',
      animation: 'slideIn 0.3s ease-out',
    },
    confirmTitle: {
      color: colors.primary,
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: spacing.md,
    },
    confirmText: {
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    confirmBtnWrapper: {
      display: 'flex',
      gap: spacing.md,
      justifyContent: 'center',
    },
    confirmBtn: {
      padding: `${spacing.sm} ${spacing.xl}`,
      borderRadius: '0.75rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.error,
      color: colors.white,
      transition: 'all 0.25s',
      flex: 1,
    },
    cancelConfirmBtn: {
      padding: `${spacing.sm} ${spacing.xl}`,
      borderRadius: '0.75rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.textSecondary,
      color: colors.white,
      transition: 'all 0.25s',
      flex: 1,
    },
    error: {
      color: colors.error,
      margin: `${spacing.md} 0`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: '0.5rem',
      background: `${colors.error}15`,
      textAlign: 'center' as 'center',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    success: {
      color: colors.success,
      margin: `${spacing.md} 0`,
      padding: `${spacing.sm} ${spacing.md}`,
      borderRadius: '0.5rem',
      background: `${colors.success}15`,
      textAlign: 'center' as 'center',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    badge: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      marginRight: spacing.xs,
      background: `${colors.primary}15`,
      color: colors.primary,
    },
    emptyState: {
      textAlign: 'center' as 'center',
      padding: `${spacing.xxl} 0`,
      color: colors.textSecondary,
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: spacing.md,
    },
    emptyStateText: {
      fontSize: '1.1rem',
      marginBottom: spacing.sm,
    },
    loadingState: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: `${spacing.xxl} 0`,
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
    '@keyframes fadeIn': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    '@keyframes slideIn': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
    dataCell: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: spacing.xs,
    },
    dataLabel: {
      color: colors.textSecondary,
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    dataValue: {
      color: colors.textPrimary,
      fontSize: '0.95rem', 
      fontWeight: 500,
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.decorationTop}></div>
        
        <div style={styles.header}>
          <h1 style={styles.title}>
            Reservations
            <div style={styles.titleAfter}></div>
          </h1>
        </div>
        
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            style={styles.search}
            type="text"
            placeholder="Search by guest name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="focus-input"
          />
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner}></div>
          </div>
        ) : filtered.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    ID
                    <div style={styles.thAfter}></div>
                  </th>
                  <th style={styles.th}>
                    Guest
                    <div style={styles.thAfter}></div>
                  </th>
                  <th style={styles.th}>
                    Room
                    <div style={styles.thAfter}></div>
                  </th>
                  <th style={styles.th}>
                    Dates
                    <div style={styles.thAfter}></div>
                  </th>
                  <th style={styles.th}>
                    Actions
                    <div style={styles.thAfter}></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} style={styles.tr} className="hover-row">
                    <td style={{...styles.td, ...styles.tdFirst}}>
                      <span style={styles.badge}>#{r.id}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dataCell}>
                        <div style={styles.dataValue}>{r.guestName}</div>
                        <div style={styles.dataLabel}>{r.guestEmail}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>Room {r.roomId}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dataCell}>
                        <div style={styles.dataValue}>
                          {formatDate(r.checkInDate)} - {formatDate(r.checkOutDate)}
                        </div>
                        <div style={styles.dataLabel}>
                          {Math.ceil((new Date(r.checkOutDate).getTime() - new Date(r.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                        </div>
                      </div>
                    </td>
                    <td style={{...styles.td, ...styles.tdLast}}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => navigate(`/reservations/${r.id}`)}
                        className="hover-button"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Details
                      </button>
                      {user && ['OWNER', 'MANAGER', 'RECEPTIONIST'].includes(user.role) && (
                        <button
                          style={{...styles.actionBtn, ...styles.paymentBtn}}
                          onClick={() => navigate(`/make-payment/${r.id}`)}
                          className="hover-button"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                          </svg>
                          Payment
                        </button>
                      )}
                      <button
                        style={{...styles.actionBtn, ...styles.deleteBtn}}
                        onClick={() => setConfirmDeleteId(r.id)}
                        className="hover-button"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📅</div>
            <div style={styles.emptyStateText}>No reservations found</div>
            <div>Try adjusting your search or check back later</div>
          </div>
        )}
      </div>
      
      {confirmDeleteId !== null && (
        <div style={styles.confirmDialog}>
          <div style={styles.confirmBox}>
            <h3 style={styles.confirmTitle}>Confirm Delete</h3>
            <p style={styles.confirmText}>
              Are you sure you want to delete this reservation? This action cannot be undone.
            </p>
            <div style={styles.confirmBtnWrapper}>
              <button 
                style={styles.confirmBtn} 
                onClick={() => handleDelete(confirmDeleteId!)}
                className="hover-button"
              >
                Delete
              </button>
              <button 
                style={styles.cancelConfirmBtn} 
                onClick={() => setConfirmDeleteId(null)}
                className="hover-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations; 