import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles';
import { getStaff } from '../services/inventoryService';
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
      flexDirection: 'column' as 'column',
      padding: spacing.md,
    },
    header: {
      padding: spacing.md,
      background: colors.white,
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: spacing.xl,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heading: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
    },
    logo: {
      fontSize: '2rem',
      marginRight: spacing.sm,
      color: colors.primary,
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.primary,
      margin: 0,
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
    },
    userEmail: {
      color: colors.textSecondary,
      fontWeight: 500,
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.sm}`,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      gap: spacing.xs,
      color: colors.textSecondary,
      transition: 'all 0.3s ease',
      borderRadius: '0.375rem',
    },
    welcomeSection: {
      backgroundColor: colors.white,
      borderRadius: '0.75rem',
      padding: spacing.xl,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      marginBottom: spacing.xl,
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
      overflow: 'hidden',
      borderTop: `4px solid ${colors.primary}`,
    },
    welcomeTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: colors.primary,
      marginBottom: spacing.md,
    },
    welcomeText: {
      fontSize: '1rem',
      color: colors.textSecondary,
      marginBottom: 0,
    },
    highlight: {
      color: colors.primary,
      fontWeight: 600,
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing.lg,
      marginBottom: spacing.xl,
    },
    statCard: {
      backgroundColor: colors.white,
      borderRadius: '0.75rem',
      padding: spacing.lg,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      transition: 'all 0.3s ease',
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
      color: colors.white,
    },
    roomIcon: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    staffIcon: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    },
    guestIcon: {
      background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: colors.primary,
      lineHeight: 1.2,
    },
    statLabel: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      fontWeight: 500,
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '0.05em',
    },
    loadingPlaceholder: {
      width: '60px',
      height: '60px',
      borderRadius: '0.5rem',
      background: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)',
      backgroundSize: '200% 100%',
      animation: 'loading 1.5s infinite linear',
    },
    '@keyframes loading': {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: spacing.lg,
    },
    featureCard: {
      backgroundColor: colors.white,
      borderRadius: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as 'column',
      border: `1px solid ${colors.border}`,
      transformOrigin: 'center bottom',
    },
    featureHeader: {
      padding: spacing.md,
      borderBottom: `1px solid ${colors.border}`,
      background: colors.backgroundAlt,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    featureTitle: {
      margin: 0,
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    featureIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(37, 99, 235, 0.1)',
      color: colors.primary,
    },
    featureBody: {
      padding: spacing.md,
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'space-between',
    },
    featureDescription: {
      color: colors.textSecondary,
      fontSize: '0.875rem',
      marginBottom: spacing.md,
    },
    featureButton: {
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
      borderRadius: '0.5rem',
      fontWeight: 600,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
  };

  const features = [
    {
      title: 'Inventory',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      description: 'View and manage hotel inventory, check room availability and status.',
      action: () => navigate('/inventory')
    },
    {
      title: 'User Management',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      description: 'Manage staff accounts, roles and permissions.',
      action: () => navigate('/users')
    },
    {
      title: 'Book Room',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      description: 'Book a new room for guests with personalized options.',
      action: () => navigate('/book-room')
    },
    {
      title: 'Reservations',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      ),
      description: 'View and manage all current and upcoming reservations.',
      action: () => navigate('/reservations')
    },
    {
      title: 'Add Room',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ),
      description: 'Add new rooms to the hotel inventory with details and pricing.',
      action: () => navigate('/add-room')
    },
    {
      title: 'Make Payment',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      description: 'Process payments for guest reservations and services.',
      action: () => navigate('/make-payment')
    },
  ];

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.heading}>
          <span style={styles.logo} role="img" aria-label="hotel">🏨</span>
          <h1 style={styles.title}>Hotel Management</h1>
        </div>
        <div style={styles.userProfile}>
          <span style={styles.userEmail}>{user?.email || 'User'}</span>
          <button 
            onClick={logout} 
            style={styles.logoutBtn}
            aria-label="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      <section style={styles.welcomeSection}>
        <h2 style={styles.welcomeTitle}>Welcome to Hotel Management System</h2>
        <p style={styles.welcomeText}>
          Hello, <span style={styles.highlight}>{user && user.email ? user.email.split('@')[0] : 'User'}</span>. 
          You have access to manage all aspects of the hotel operations.
        </p>
      </section>

      <section style={styles.stats}>
        <div style={styles.statCard} className="card-hover-effect">
          <div style={{...styles.statIcon, ...styles.roomIcon}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          {loading ? (
            <div style={styles.loadingPlaceholder}></div>
          ) : (
            <div style={styles.statValue}>{roomCount ?? '-'}</div>
          )}
          <div style={styles.statLabel}>Rooms</div>
        </div>

        <div style={styles.statCard} className="card-hover-effect">
          <div style={{...styles.statIcon, ...styles.staffIcon}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          {loading ? (
            <div style={styles.loadingPlaceholder}></div>
          ) : (
            <div style={styles.statValue}>{staffCount ?? '-'}</div>
          )}
          <div style={styles.statLabel}>Staff</div>
        </div>

        <div style={styles.statCard} className="card-hover-effect">
          <div style={{...styles.statIcon, ...styles.guestIcon}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          {loading ? (
            <div style={styles.loadingPlaceholder}></div>
          ) : (
            <div style={styles.statValue}>{guestCount ?? '-'}</div>
          )}
          <div style={styles.statLabel}>Guests</div>
        </div>
      </section>

      <section style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} style={styles.featureCard} className="card-hover-effect">
            <div style={styles.featureHeader}>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <div style={styles.featureIcon}>{feature.icon}</div>
            </div>
            <div style={styles.featureBody}>
              <p style={styles.featureDescription}>{feature.description}</p>
              <button 
                onClick={feature.action} 
                style={styles.featureButton}
                className="card-hover-effect"
              >
                {feature.title}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard; 