import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors, spacing } from '../styles';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      position: 'relative' as const,
      overflow: 'hidden',
    },
    backgroundElements: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      opacity: 0.6,
    },
    circle1: {
      position: 'absolute' as const,
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      top: '-100px',
      right: '-100px',
    },
    circle2: {
      position: 'absolute' as const,
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      bottom: '-80px',
      left: '-80px',
    },
    cardContainer: {
      width: '420px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative' as const,
      zIndex: 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      padding: `${spacing.xl} 0`,
      textAlign: 'center' as 'center',
      borderBottom: `1px solid ${colors.border}`,
      marginBottom: spacing.lg,
      background: 'rgba(255, 255, 255, 0.1)',
    },
    headerText: {
      color: colors.primary,
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '0.025em',
      margin: 0,
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
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
      transition: 'all 0.3s ease',
      outline: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    focusedInput: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}30`,
    },
    inputIcon: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      right: spacing.sm,
      color: colors.textSecondary,
      cursor: 'pointer',
      padding: spacing.xs,
      borderRadius: '9999px',
      transition: 'all 0.3s ease',
    },
    errorText: {
      color: colors.error,
      fontSize: '0.875rem',
      marginTop: spacing.xs,
      textAlign: 'center' as 'center',
      fontWeight: 500,
      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
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
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px rgba(30, 58, 138, 0.2)',
      marginTop: spacing.md,
      marginBottom: spacing.md,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(30, 58, 138, 0.25)',
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
      position: 'relative' as const,
      transition: 'all 0.3s ease',
    },
    linkHover: {
      color: colors.primaryLight,
    },
    logo: {
      width: '90px',
      height: '90px',
      margin: '0 auto 1.25rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
      color: colors.white,
      fontSize: '2.25rem',
      fontWeight: 700,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      position: 'relative' as const,
    },
    logoInner: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'pulse 2s infinite',
    },
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.4)',
      },
      '70%': {
        boxShadow: '0 0 0 10px rgba(37, 99, 235, 0)',
      },
      '100%': {
        boxShadow: '0 0 0 0 rgba(37, 99, 235, 0)',
      },
    },
    '@keyframes shake': {
      '10%, 90%': {
        transform: 'translate3d(-1px, 0, 0)',
      },
      '20%, 80%': {
        transform: 'translate3d(2px, 0, 0)',
      },
      '30%, 50%, 70%': {
        transform: 'translate3d(-4px, 0, 0)',
      },
      '40%, 60%': {
        transform: 'translate3d(4px, 0, 0)',
      },
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backgroundElements}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
      </div>
      <div style={styles.cardContainer}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoInner}>
              <span role="img" aria-label="hotel">🏨</span>
            </div>
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
                autoComplete="email"
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Password"
                style={styles.input}
                autoComplete="current-password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.inputIcon}
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.26 2.1-3.17 4.06-5.06M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.22 1.1M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.89 11 7-1.09 1.88-3.05 4.5-6.1 6.9M1 1l22 22" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </div>
            </div>
            {error && <div style={styles.errorText}>{error}</div>}
            <button 
              type="submit" 
              disabled={loading} 
              style={{
                ...styles.button,
                ...(loading ? {} : { ':hover': styles.buttonHover })
              }}
            >
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