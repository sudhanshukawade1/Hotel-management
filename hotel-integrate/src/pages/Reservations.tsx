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
      background: `linear-gradient(120deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    container: {
      width: '900px',
      maxWidth: '98vw',
      background: colors.white,
      borderRadius: '1.5rem',
      boxShadow: '0 10px 32px rgba(0,0,0,0.10)',
      padding: spacing.xxl,
      margin: 'auto',
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: spacing.lg,
      textAlign: 'center' as 'center',
    },
    search: {
      width: '100%',
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      marginBottom: spacing.lg,
    },
    table: {
      width: '100%',
      borderCollapse: 'separate' as 'separate',
      borderSpacing: '0 12px',
      marginBottom: spacing.lg,
    },
    th: {
      textAlign: 'left' as 'left',
      padding: spacing.md,
      color: colors.textSecondary,
      fontWeight: 600,
      fontSize: '0.95rem',
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '0.07em',
    },
    tr: {
      background: colors.backgroundAlt,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      borderRadius: '0.75rem',
      transition: 'all 0.2s',
    },
    td: {
      padding: spacing.md,
      color: colors.textPrimary,
      fontSize: '1rem',
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
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
      transition: 'all 0.2s',
    },
    deleteBtn: {
      background: colors.error,
    },
    confirmDialog: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    confirmBox: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      padding: spacing.xxl,
      minWidth: '320px',
      textAlign: 'center' as 'center',
    },
    confirmBtn: {
      marginRight: spacing.md,
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.error,
      color: colors.white,
      transition: 'all 0.2s',
    },
    cancelConfirmBtn: {
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: 600,
      cursor: 'pointer',
      background: colors.info,
      color: colors.white,
      transition: 'all 0.2s',
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
      <div style={styles.container}>
        <div style={styles.title}>Reservations</div>
        <input
          style={styles.search}
          type="text"
          placeholder="Search by guest name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Guest Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Room ID</th>
              <th style={styles.th}>Check-In</th>
              <th style={styles.th}>Check-Out</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{r.guestName}</td>
                <td style={styles.td}>{r.guestEmail}</td>
                <td style={styles.td}>{r.roomId}</td>
                <td style={styles.td}>{r.checkInDate}</td>
                <td style={styles.td}>{r.checkOutDate}</td>
                <td style={styles.td}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => navigate(`/reservation/${r.id}`)}
                  >
                    Details
                  </button>
                  {user && ['OWNER', 'MANAGER', 'RECEPTIONIST'].includes(user.role) && (
                    <button
                      style={styles.actionBtn}
                      onClick={() => navigate(`/make-payment/${r.id}`)}
                    >
                      Make Payment
                    </button>
                  )}
                  <button
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                    onClick={() => setConfirmDeleteId(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && <div style={{ textAlign: 'center', color: colors.textSecondary }}>No reservations found.</div>}
      </div>
      {confirmDeleteId !== null && (
        <div style={styles.confirmDialog}>
          <div style={styles.confirmBox}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete reservation ID {confirmDeleteId}?</p>
            <button style={styles.confirmBtn} onClick={() => handleDelete(confirmDeleteId!)}>Delete</button>
            <button style={styles.cancelConfirmBtn} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations; 