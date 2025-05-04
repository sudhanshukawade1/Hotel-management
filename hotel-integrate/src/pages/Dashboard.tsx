import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles';
import {  getStaff } from '../services/inventoryService';
import { getAllReservations, getAllRooms } from '../services/reservationService';

const Dashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [roomCount, setRoomCount] = useState<number | null>(null);
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [rooms, staff, reservations] = await Promise.all([
          getAllRooms(),
          getStaff(),
          token ? getAllReservations(token) : Promise.resolve([]),
        ]);
        setRoomCount(rooms.length);
        setStaffCount(staff.length);
        // Count unique guest emails
        const uniqueGuests = new Set(reservations.map((r: any) => r.guestEmail));
        setGuestCount(uniqueGuests.size);
      } catch {
        setRoomCount(null);
        setStaffCount(null);
        setGuestCount(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [token]);

  // Styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: `linear-gradient(140deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    },
    card: {
      width: '500px',
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      padding: spacing.xxl,
    },
    header: {
      textAlign: 'center' as 'center',
      marginBottom: spacing.xl,
    },
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.75rem',
      marginBottom: spacing.md,
    },
    welcomeText: {
      fontSize: '1.125rem',
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      fontWeight: 500,
    },
    highlight: {
      color: colors.primary,
      fontWeight: 600,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: spacing.md,
    },
    button: {
      padding: `${spacing.md} ${spacing.lg}`,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.sm,
    },
    logoutButton: {
      background: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      boxShadow: 'none',
      marginTop: spacing.md,
    },
    logo: {
      fontSize: '2.5rem',
      marginBottom: spacing.md,
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: spacing.xl,
    },
    statItem: {
      textAlign: 'center' as 'center',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.primary,
    },
    statLabel: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      fontWeight: 500,
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span role="img" aria-label="hotel">🏨</span>
          </div>
          <h1 style={styles.title}>Hotel Management</h1>
          <p style={styles.welcomeText}>
            Welcome <span style={styles.highlight}>{user && user.email ? user.email : 'User'}</span>
          </p>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{loading ? '...' : roomCount ?? '-'}</div>
            <div style={styles.statLabel}>Rooms</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{loading ? '...' : staffCount ?? '-'}</div>
            <div style={styles.statLabel}>Staff</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statValue}>{loading ? '...' : guestCount ?? '-'}</div>
            <div style={styles.statLabel}>Guests</div>
          </div>
        </div>

        <div style={styles.buttonContainer}>
          <button 
            onClick={() => navigate('/inventory')} 
            style={styles.button}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V5C22 3.89543 21.1046 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 9H8V15H16V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Inventory
          </button>
          <button
            onClick={() => navigate('/users')}
            style={styles.button}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.8954 16.1046 17 15 17H9C7.89543 17 7 17.8954 7 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            User Management
          </button>
          <button
            onClick={() => navigate('/book-room')}
            style={styles.button}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3H16V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Book Room
          </button>
          <button
            onClick={() => navigate('/reservations')}
            style={styles.button}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reservations
          </button>
          {user && ['OWNER', 'MANAGER', 'RECEPTIONIST'].includes(user.role) && (
            <button
              onClick={() => navigate('/make-payment')}
              style={styles.button}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7H20M4 11H20M4 15H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Make Payment
            </button>
          )}
          <button
            onClick={() => navigate('/add-room')}
            style={styles.button}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Room
          </button>
          <button 
            onClick={logout} 
            style={{...styles.button, ...styles.logoutButton}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 