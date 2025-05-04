// Color palette
export const colors = {
  primary: '#1e3a8a',
  primaryLight: '#2563eb',
  primaryDark: '#1e40af',
  secondary: '#8b5cf6',
  accent: '#f97316',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  background: '#f8fafc',
  backgroundAlt: '#f1f5f9',
  white: '#ffffff',
  black: '#0f172a',
  border: '#e2e8f0',
  divider: '#e5e7eb',
};

// Spacing system
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

// Border radius
export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

// Shadows
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 15px 25px rgba(0, 0, 0, 0.1)',
  card: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  button: '0 4px 14px rgba(30, 58, 138, 0.2)',
};

// Typography
export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    loose: 2,
  },
};

// Z-index
export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
};

// Transitions
export const transitions = {
  base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Gradients
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.primary} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary} 0%, #6d28d9 100%)`,
  accent: `linear-gradient(135deg, ${colors.accent} 0%, #ea580c 100%)`,
};

// Common component styles
export const componentStyles = {
  card: {
    base: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      boxShadow: shadows.card,
      overflow: 'hidden',
      transition: transitions.base,
      border: `1px solid ${colors.border}`,
    },
    hover: {
      transform: 'translateY(-4px)',
      boxShadow: shadows.xl,
    },
  },
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.semibold,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
      transition: transitions.base,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    },
    primary: {
      background: gradients.primary,
      color: colors.white,
      boxShadow: shadows.button,
    },
    secondary: {
      backgroundColor: colors.white,
      color: colors.primary,
      border: `1px solid ${colors.primary}`,
    },
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    },
  },
  input: {
    base: {
      width: '100%',
      padding: `${spacing.md} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
      color: colors.textPrimary,
      backgroundColor: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: borderRadius.md,
      transition: transitions.base,
      outline: 'none',
    },
    focus: {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}30`,
    },
  },
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      borderRadius: borderRadius.full,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
    },
    success: {
      backgroundColor: colors.success,
      color: colors.white,
    },
    error: {
      backgroundColor: colors.error,
      color: colors.white,
    },
    warning: {
      backgroundColor: colors.warning,
      color: colors.white,
    },
    info: {
      backgroundColor: colors.info,
      color: colors.white,
    },
  },
  glassEffect: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

// Layout styles
export const layoutStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.md}`,
  },
  section: {
    padding: `${spacing.xl} 0`,
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  grid: {
    display: 'grid',
    gap: spacing.lg,
  },
};

// Export all as a combined object for easy access
export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  zIndex,
  transitions,
  gradients,
  componentStyles,
  layoutStyles,
}; 