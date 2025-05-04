import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLES, Role } from '../services/authService';
import { colors, spacing } from '../styles';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('OWNER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register({ email, password, role });
      setSuccess('User registered successfully!');
      setEmail('');
      setPassword('');
      setRole('OWNER');
      // setTimeout(() => window.location.href = '/login', 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
    },
    cardContainer: {
      width: '400px',
      background: colors.white,
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    header: {
      padding: `${spacing.xl} 0`,
      textAlign: 'center' as 'center',
      borderBottom: `1px solid ${colors.border}`,
      marginBottom: spacing.lg,
    },
    headerText: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '0.025em',
      margin: 0,
    },
    formContainer: {
      padding: `0 ${spacing.xl} ${spacing.xl} ${spacing.xl}`,
    },
    inputGroup: {
      marginBottom: spacing.lg,
      position: 'relative' as const,
    },
    input: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.7rem top 50%',
      backgroundSize: '0.7rem auto',
    },
    errorText: {
      color: colors.error,
      fontSize: '0.875rem',
      marginTop: spacing.xs,
      textAlign: 'center' as 'center',
      fontWeight: 500,
    },
    successText: {
      color: colors.success,
      fontSize: '0.875rem',
      marginTop: spacing.xs,
      textAlign: 'center' as 'center',
      fontWeight: 500,
    },
    button: {
      width: '100%',
      padding: spacing.md,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 10px rgba(15, 23, 42, 0.2)',
      marginTop: spacing.md,
      marginBottom: spacing.md,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    linkContainer: {
      textAlign: 'center' as 'center',
      fontSize: '0.875rem',
      color: colors.textSecondary,
      marginTop: spacing.sm,
    },
    link: {
      color: colors.primary,
      fontWeight: 500,
      textDecoration: 'none',
    },
    logo: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: colors.primaryLight,
      color: colors.white,
      fontSize: '2rem',
      fontWeight: 700,
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardContainer}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span role="img" aria-label="hotel">🏨</span>
          </div>
          <h1 style={styles.headerText}>Create Account</h1>
        </div>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Password"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value as Role)} 
                required 
                style={styles.select}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            {error && <div style={styles.errorText}>{error}</div>}
            {success && <div style={styles.successText}>{success}</div>}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? <span className="spinner"></span> : 'Sign Up'}
            </button>
            <div style={styles.linkContainer}>
              Already have an account? <a href="/login" style={styles.link}>Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 