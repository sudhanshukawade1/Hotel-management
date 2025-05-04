import React, { useState } from 'react';
import { fetchAvailableRooms, bookRoom, Room } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';

const BookRoom: React.FC = () => {
  const { user, token } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState(user?.email || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setRooms([]);
    try {
      const data = await fetchAvailableRooms(checkIn, checkOut);
      setRooms(data);
      if (data.length === 0) setError('No rooms available for selected dates.');
    } catch (err: any) {
      setError('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setGuestName(user?.email || '');
    setGuestEmail(user?.email || '');
    setSuccess('');
    setError('');
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !token || !user) return;
    setBookingLoading(true);
    setError('');
    setSuccess('');
    try {
      await bookRoom(
        {
          guestName,
          guestEmail,
          roomId: selectedRoom.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
        token,
        user.email,
        user.role
      );
      setSuccess('Room booked successfully!');
      setShowModal(false);
      setRooms([]);
      setCheckIn('');
      setCheckOut('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Styles
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
      width: '800px',
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
    title: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '2.25rem',
      marginBottom: spacing.lg,
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
      display: 'inline-block',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: spacing.md,
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
    titleContainer: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    form: {
      display: 'flex',
      gap: spacing.md,
      marginBottom: spacing.xl,
      justifyContent: 'center',
      flexWrap: 'wrap' as 'wrap',
      background: colors.backgroundAlt,
      padding: spacing.lg,
      borderRadius: '1rem',
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: spacing.xs,
      flex: '1',
      minWidth: '180px',
    },
    inputLabel: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    input: {
      padding: `${spacing.md} ${spacing.md}`,
      borderRadius: '0.75rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      minWidth: '160px',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}20`,
    },
    button: {
      padding: `${spacing.md} ${spacing.xl}`,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '0.75rem',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(15,23,42,0.15)',
      transition: 'all 0.3s',
      alignSelf: 'flex-end',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      minWidth: '160px',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(15,23,42,0.18)',
    },
    roomGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: spacing.lg,
      marginTop: spacing.lg,
    },
    roomCard: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      padding: spacing.lg,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: `2px solid transparent`,
      position: 'relative' as 'relative',
      overflow: 'hidden',
    },
    roomCardHover: {
      border: `2px solid ${colors.primary}`,
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 25px rgba(0,0,0,0.12)',
    },
    roomCardDecoration: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      background: colors.primary,
    },
    modalOverlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out',
    },
    modal: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      padding: spacing.xxl,
      minWidth: '340px',
      maxWidth: '95vw',
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
      animation: 'slideIn 0.3s ease-out',
    },
    closeModal: {
      position: 'absolute' as 'absolute',
      top: spacing.md,
      right: spacing.md,
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: colors.textSecondary,
      cursor: 'pointer',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
    },
    closeModalHover: {
      background: `${colors.error}20`,
      color: colors.error,
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
    roomIcon: {
      fontSize: '3rem',
      marginBottom: spacing.sm,
      display: 'inline-block',
    },
    roomTypeTag: {
      display: 'inline-block',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: '0.5rem',
      background: `${colors.primary}15`,
      color: colors.primary,
      fontSize: '0.8rem',
      fontWeight: 600,
      marginTop: spacing.xs,
    },
    roomPrice: {
      color: colors.textPrimary,
      fontWeight: 700,
      fontSize: '1.2rem',
      margin: `${spacing.sm} 0`,
    },
    roomNumber: {
      fontWeight: 700,
      color: colors.primary,
      fontSize: '1.1rem',
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    '@keyframes fadeIn': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    '@keyframes slideIn': {
      '0%': { transform: 'translateY(-20px)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
    noResults: {
      textAlign: 'center' as 'center',
      color: colors.textSecondary,
      padding: `${spacing.xl} 0`,
      fontSize: '1.1rem',
    },
    shimmer: {
      background: `linear-gradient(90deg, ${colors.backgroundAlt} 0%, ${colors.background} 50%, ${colors.backgroundAlt} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '0.5rem',
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
    loadingCard: {
      height: '180px',
      borderRadius: '1rem',
      background: colors.backgroundAlt,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.decorationTop}></div>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>
            Book a Room
            <div style={styles.titleAfter}></div>
          </h1>
        </div>
        
        <form style={styles.form} onSubmit={handleSearch}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel} htmlFor="checkIn">Check-in Date</label>
            <input
              id="checkIn"
              type="date"
              style={styles.input}
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="focus-input"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel} htmlFor="checkOut">Check-out Date</label>
            <input
              id="checkOut"
              type="date"
              style={styles.input}
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              required
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="focus-input"
            />
          </div>
          
          <button style={styles.button} type="submit" disabled={loading} className="hover-button">
            {loading ? (
              'Searching...'
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search Rooms
              </>
            )}
          </button>
        </form>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        {loading ? (
          <div style={styles.roomGrid}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ ...styles.loadingCard, ...styles.shimmer }}></div>
            ))}
          </div>
        ) : (
          <>
            {rooms.length > 0 ? (
              <div style={styles.roomGrid}>
                {rooms.map(room => (
                  <div
                    key={room.id}
                    style={styles.roomCard}
                    onClick={() => openBookingModal(room)}
                    tabIndex={0}
                    className="hover-card"
                  >
                    <div style={styles.roomCardDecoration}></div>
                    <div style={styles.roomIcon}>🛏️</div>
                    <div style={styles.roomNumber}>Room {room.roomNumber}</div>
                    <div style={styles.roomTypeTag}>{room.type}</div>
                    <div style={styles.roomPrice}>₹{room.price} / night</div>
                    <button 
                      style={{ ...styles.button, fontSize: '0.9rem', marginTop: spacing.sm, padding: `${spacing.sm} ${spacing.lg}` }} 
                      className="hover-button"
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              rooms.length === 0 && !loading && !error && (
                <div style={styles.noResults}>
                  <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🔍</div>
                  <div>Search for available rooms by selecting dates</div>
                </div>
              )
            )}
          </>
        )}
      </div>
      
      {showModal && selectedRoom && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button 
              style={styles.closeModal} 
              onClick={() => setShowModal(false)}
              className="hover-close"
            >
              &times;
            </button>
            <h2 style={{ color: colors.primary, marginBottom: spacing.md }}>
              Book Room {selectedRoom.roomNumber}
            </h2>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleBook}>
              <div style={{ ...styles.inputGroup, marginBottom: spacing.md }}>
                <label style={styles.inputLabel} htmlFor="guestName">Guest Name</label>
                <input
                  id="guestName"
                  style={styles.input}
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  required
                  placeholder="Enter guest name"
                  className="focus-input"
                />
              </div>
              
              <div style={{ ...styles.inputGroup, marginBottom: spacing.md }}>
                <label style={styles.inputLabel} htmlFor="guestEmail">Guest Email</label>
                <input
                  id="guestEmail"
                  style={styles.input}
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  required
                  placeholder="Enter guest email"
                  className="focus-input"
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing.lg, borderTop: `1px solid ${colors.border}`, paddingTop: spacing.lg }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Price per night</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: colors.primary }}>₹{selectedRoom.price}</div>
                </div>
                
                <button 
                  style={styles.button} 
                  type="submit" 
                  disabled={bookingLoading}
                  className="hover-button"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRoom; 