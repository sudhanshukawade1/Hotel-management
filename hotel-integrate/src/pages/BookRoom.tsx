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
      background: `linear-gradient(120deg, ${colors.background} 0%, ${colors.backgroundAlt} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
    },
    container: {
      width: '600px',
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
    form: {
      display: 'flex',
      gap: spacing.md,
      marginBottom: spacing.xl,
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
    roomGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: spacing.lg,
      marginTop: spacing.lg,
    },
    roomCard: {
      background: colors.backgroundAlt,
      borderRadius: '1rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: spacing.lg,
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      border: `2px solid transparent`,
    },
    roomCardHover: {
      border: `2px solid ${colors.primary}`,
      transform: 'scale(1.03)',
    },
    modalOverlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      padding: spacing.xxl,
      minWidth: '340px',
      maxWidth: '95vw',
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
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
        <div style={styles.title}>Book a Room</div>
        <form style={styles.form} onSubmit={handleSearch}>
          <input
            type="date"
            style={styles.input}
            value={checkIn}
            onChange={e => setCheckIn(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            placeholder="Check-in"
          />
          <input
            type="date"
            style={styles.input}
            value={checkOut}
            onChange={e => setCheckOut(e.target.value)}
            required
            min={checkIn || new Date().toISOString().split('T')[0]}
            placeholder="Check-out"
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Rooms'}
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <div style={styles.roomGrid}>
          {rooms.map(room => (
            <div
              key={room.id}
              style={styles.roomCard}
              onClick={() => openBookingModal(room)}
              tabIndex={0}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: spacing.sm }}>🛏️</div>
              <div style={{ fontWeight: 700, color: colors.primary }}>{room.roomNumber} - {room.type}</div>
              <div style={{ color: colors.textSecondary, margin: `${spacing.xs} 0` }}>
                ₹{room.price} / night
              </div>
              <button style={{ ...styles.button, fontSize: '0.9rem', marginTop: spacing.sm }}>Book</button>
            </div>
          ))}
        </div>
      </div>
      {showModal && selectedRoom && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.closeModal} onClick={() => setShowModal(false)}>&times;</button>
            <h2 style={{ color: colors.primary, marginBottom: spacing.md }}>Book Room {selectedRoom.roomNumber}</h2>
            <form onSubmit={handleBook}>
              <input
                style={styles.input}
                type="text"
                placeholder="Guest Name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                required
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Guest Email"
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
                required
              />
              <button style={{ ...styles.button, width: '100%', marginTop: spacing.md }} type="submit" disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>{success}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRoom; 