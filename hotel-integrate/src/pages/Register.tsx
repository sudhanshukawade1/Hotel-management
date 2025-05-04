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
  const [showPassword, setShowPassword] = useState(false);

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
      const backendMsg = err.response?.data?.message || err.response?.data?.error;
      if (backendMsg && backendMsg.toLowerCase().includes('email already in use')) {
        setError('User already registered');
      } else {
        setError(backendMsg || 'Registration failed');
      }
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
    backgroundShapes: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.6,
    },
    circle1: {
      position: 'absolute' as const,
      width: '350px',
      height: '350px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      top: '-100px',
      left: '-150px',
    },
    circle2: {
      position: 'absolute' as const,
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.08)',
      bottom: '-50px',
      right: '-100px',
    },
    cardContainer: {
      width: '420px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1.25rem',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      position: 'relative' as const,
      zIndex: 1,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
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
    inputLabel: {
      display: 'block',
      marginBottom: spacing.xs,
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.textPrimary,
    },
    input: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    inputFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.15)`,
    },
    select: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none' as 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.7rem top 50%',
      backgroundSize: '0.7rem auto',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    selectFocus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.15)`,
    },
    passwordIcon: { 
      position: 'absolute' as const, 
      right: 12, 
      top: '50%', 
      transform: 'translateY(-50%)', 
      cursor: 'pointer', 
      color: colors.textSecondary,
      padding: '5px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
    },
    passwordIconHover: {
      color: colors.primary,
      background: 'rgba(37, 99, 235, 0.1)',
    },
    errorText: {
      color: colors.error,
      fontSize: '0.875rem',
      marginTop: spacing.xs,
      textAlign: 'center' as 'center',
      fontWeight: 500,
      padding: spacing.xs,
      borderRadius: '0.5rem',
      background: 'rgba(239, 68, 68, 0.1)',
      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
    },
    successText: {
      color: colors.success,
      fontSize: '0.875rem',
      marginTop: spacing.xs,
      textAlign: 'center' as 'center',
      fontWeight: 500,
      padding: spacing.xs,
      borderRadius: '0.5rem',
      background: 'rgba(16, 185, 129, 0.1)',
      animation: 'pulse 1.5s infinite',
    },
    button: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
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
      boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4)',
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
      transition: 'all 0.2s ease',
    },
    linkHover: {
      color: colors.primaryLight,
    },
    linkAfter: {
      content: "''",
      position: 'absolute' as const,
      width: '100%',
      transform: 'scaleX(0)',
      height: '1px',
      bottom: -2,
      left: 0,
      backgroundColor: colors.primary,
      transformOrigin: 'bottom right',
      transition: 'transform 0.3s ease-out',
    },
    linkHoverAfter: {
      transformOrigin: 'bottom left',
      transform: 'scaleX(1)',
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
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
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
      <div style={styles.backgroundShapes}>
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
          <h1 style={styles.headerText}>Create Account</h1>
        </div>
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.inputLabel}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={styles.input}
                className="hover-input"
                autoComplete="email"
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.inputLabel}>Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={styles.input}
                className="hover-input"
                autoComplete="new-password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.passwordIcon}
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="hover-effect"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.26 2.1-3.17 4.06-5.06M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .39-.08.76-.22 1.1M6.1 6.1A10.94 10.94 0 0 1 12 5c5 0 9.27 3.89 11 7-1.09 1.88-3.05 4.5-6.1 6.9M1 1l22 22" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="role" style={styles.inputLabel}>User Role</label>
              <select 
                id="role"
                value={role} 
                onChange={e => setRole(e.target.value as Role)} 
                required 
                style={styles.select}
                className="hover-input"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            {error && <div style={styles.errorText}>{error}</div>}
            {success && <div style={styles.successText}>{success}</div>}
            <button 
              type="submit" 
              disabled={loading} 
              style={styles.button}
              className="hover-button"
            >
              {loading ? <span className="spinner"></span> : 'Sign Up'}
            </button>
            <div style={styles.linkContainer}>
              Already have an account? <a href="/login" style={styles.link} className="hover-link">Sign In</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 