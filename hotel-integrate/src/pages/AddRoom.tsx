import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AddRoom: React.FC = () => {
  const { token } = useAuth();
  const [roomNumber, setRoomNumber] = useState('');
  const [type, setType] = useState('SINGLE');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(
        `${API_URL}/reservation-service/rooms/add`,
        {
          roomNumber,
          type,
          price: parseFloat(price),
          available,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setSuccess('Room added successfully!');
      setRoomNumber('');
      setType('SINGLE');
      setPrice('');
      setAvailable(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add room.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.backgroundAlt} 0%, ${colors.background} 100%)`,
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
      padding: `${spacing.xxl} ${spacing.xxl}`,
      width: '450px',
      maxWidth: '95vw',
      textAlign: 'center' as 'center',
      position: 'relative' as 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.18)',
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
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: spacing.lg,
      marginTop: spacing.xl,
    },
    inputGroup: {
      textAlign: 'left' as 'left',
    },
    label: {
      display: 'block',
      marginBottom: spacing.xs,
      color: colors.textPrimary,
      fontWeight: 600,
      fontSize: '0.95rem',
    },
    input: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      borderRadius: '0.75rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box' as 'border-box',
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}20`,
    },
    select: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      borderRadius: '0.75rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      appearance: 'none' as 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem top 50%',
      backgroundSize: '0.65rem auto',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      justifyContent: 'flex-start',
      marginTop: spacing.sm,
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
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
      marginTop: spacing.md,
      position: 'relative' as 'relative',
      overflow: 'hidden',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 18px rgba(15,23,42,0.18)',
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
      fontSize: '2rem',
      margin: `0 auto ${spacing.md} auto`,
      display: 'block',
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.decorationTop}></div>
        <span role="img" aria-label="room" style={styles.roomIcon}>🛏️</span>
        <h1 style={styles.title}>
          Add New Room
          <div style={styles.titleAfter}></div>
        </h1>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="roomNumber">Room Number</label>
            <input
              id="roomNumber"
              style={styles.input}
              type="text"
              placeholder="Enter room number"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              required
              className="focus-input"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="roomType">Room Type</label>
            <select
              id="roomType"
              style={styles.select}
              value={type}
              onChange={e => setType(e.target.value)}
              required
              className="focus-input"
            >
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SUITE">Suite</option>
              <option value="DELUXE">Deluxe</option>
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="roomPrice">Price per Night (₹)</label>
            <input
              id="roomPrice"
              style={styles.input}
              type="number"
              placeholder="Enter price per night"
              value={price}
              onChange={e => setPrice(e.target.value)}
              min="0"
              step="0.01"
              required
              className="focus-input"
            />
          </div>
          
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={available}
              onChange={e => setAvailable(e.target.checked)}
              id="availableCheckbox"
              style={styles.checkbox}
            />
            <label htmlFor="availableCheckbox" style={{cursor: 'pointer', fontWeight: 500}}>Available for booking</label>
          </div>
          
          <button style={styles.button} type="submit" disabled={loading} className="hover-button">
            {loading ? 'Adding Room...' : 'Add Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom; 