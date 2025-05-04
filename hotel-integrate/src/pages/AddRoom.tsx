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
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    input: {
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
    },
    select: {
      padding: spacing.md,
      borderRadius: '0.5rem',
      border: `1px solid ${colors.border}`,
      fontSize: '1rem',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      justifyContent: 'flex-start',
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
      marginTop: spacing.md,
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
      <div style={styles.card}>
        <div style={styles.title}>Add New Room</div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Room Number"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            required
          />
          <select
            style={styles.select}
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="SUITE">Suite</option>
            <option value="DELUXE">Deluxe</option>
          </select>
          <input
            style={styles.input}
            type="number"
            placeholder="Price per Night"
            value={price}
            onChange={e => setPrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={available}
              onChange={e => setAvailable(e.target.checked)}
              id="availableCheckbox"
            />
            <label htmlFor="availableCheckbox">Available</label>
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Room'}
          </button>
        </form>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
      </div>
    </div>
  );
};

export default AddRoom; 