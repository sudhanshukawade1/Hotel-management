import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors, spacing} from '../styles';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
    focusedInput: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 2px ${colors.primaryLight}30`,
    },
    inputIcon: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      left: spacing.sm,
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
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
          <h1 style={styles.headerText}>Welcome Back</h1>
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
            {error && <div style={styles.errorText}>{error}</div>}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? <span className="spinner"></span> : 'Sign In'}
            </button>
            <div style={styles.linkContainer}>
              Don't have an account? <a href="/register" style={styles.link}>Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 