// Premium UI Theme and Common Styles with 3D and Dynamic Elements

// Color palette - updated with more vibrant and sophisticated colors
export const colors = {
  primary: '#0f3460',         // Deep navy blue
  primaryLight: '#2563eb',    // Vibrant blue
  primaryDark: '#1e2f70',     // Darker blue
  secondary: '#9d4edd',       // Rich purple
  accent: '#e94560',          // Vibrant coral red
  success: '#06d6a0',         // Bright teal
  error: '#ff5252',           // Bright red
  warning: '#ffb703',         // Golden yellow
  info: '#00b4d8',            // Bright cyan
  textPrimary: '#0f172a',     // Very dark blue for text
  textSecondary: '#64748b',   // Medium slate gray for secondary text
  background: '#f8fafc',      // Very light gray for backgrounds
  backgroundAlt: '#f1f5f9',   // Alternative light background
  white: '#ffffff',           // White
  black: '#0f172a',           // Near black
  border: '#e2e8f0',          // Light gray for borders
  divider: '#e5e7eb',         // Light gray for dividers
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
  glassBackground: 'rgba(255, 255, 255, 0.8)', // Transparent white for glass effect
  glassDark: 'rgba(15, 23, 42, 0.7)',          // Transparent dark for glass effect
  glassGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
  cardGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
  neonGlow: '0 0 10px rgba(157, 78, 221, 0.6), 0 0 20px rgba(157, 78, 221, 0.4), 0 0 30px rgba(157, 78, 221, 0.2)',
  shimmerGradient: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)'
};

// Typography - Updated with modern font combinations
export const typography = {
  fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", system-ui, sans-serif',
  displayFont: '"Clash Display", "Satoshi", "Space Grotesk", sans-serif',
  monoFont: '"JetBrains Mono", "Fira Code", monospace',
  h1: {
    fontSize: '2.75rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    fontFamily: '"Clash Display", "Satoshi", sans-serif',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    fontFamily: '"Clash Display", "Satoshi", sans-serif',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  h4: {
    fontSize: '1.375rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textTransform: 'none',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '2.5rem',
  xxxl: '3rem',
};

// 3D Elements and Effects
export const effects = {
  // 3D Card Transform
  card3D: `
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: transform 0.3s ease;
    &:hover {
      transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
    }
  `,
  
  // Parallax effect
  parallax: `
    transition: transform 0.2s ease;
    transform-style: preserve-3d;
    will-change: transform;
  `,
  
  // Floating animation
  float: `
    animation: float 6s ease-in-out infinite;
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
  `,
  
  // Shimmer effect
  shimmer: `
    position: relative;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: ${colors.shimmerGradient};
      animation: shimmer 2.5s infinite;
      @keyframes shimmer {
        100% { left: 150%; }
      }
    }
  `,
  
  // Neon glow effect
  neonGlow: `
    box-shadow: ${colors.neonGlow};
  `,
  
  // Morphing background
  morphBackground: `
    background: linear-gradient(-45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.info});
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  
  // 3D Button effect
  button3D: `
    transform: translateY(0);
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 0 0 ${colors.primaryDark}, 0 8px 12px rgba(0, 0, 0, 0.1);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 0 0 ${colors.primaryDark}, 0 12px 16px rgba(0, 0, 0, 0.15);
    }
    &:active {
      transform: translateY(2px);
      box-shadow: 0 2px 0 0 ${colors.primaryDark}, 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `,
  
  // Neumorphic effect
  neumorphic: `
    background: ${colors.backgroundAlt};
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
    border-radius: 20px;
  `,
};

// Common component styles
export const components = {
  // Card styles - Updated with 3D effects
  card: {
    background: colors.glassGradient,
    backdropFilter: 'blur(10px)',
    borderRadius: '1.25rem',
    boxShadow: colors.boxShadow,
    padding: spacing.xl,
    border: `1px solid rgba(255, 255, 255, 0.3)`,
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 30px rgba(0, 0, 0, 0.12)',
    }
  },
  
  // 3D Card effect
  card3D: {
    background: colors.glassGradient,
    backdropFilter: 'blur(10px)',
    borderRadius: '1.25rem',
    boxShadow: colors.boxShadow,
    padding: spacing.xl,
    border: `1px solid rgba(255, 255, 255, 0.3)`,
    transition: 'transform 0.5s ease, box-shadow 0.5s ease',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
    '&:hover': {
      transform: 'translateY(-10px) rotateX(5deg) rotateY(5deg)',
      boxShadow: '0 25px 35px rgba(0, 0, 0, 0.15)',
    }
  },
  
  // Glass card effect - Enhanced with better reflections
  glassCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '1.25rem',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
    border: `1px solid rgba(255, 255, 255, 0.5)`,
    padding: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
      transform: 'rotate(30deg)',
      pointerEvents: 'none',
    }
  },
  
  // Buttons - Updated with 3D effects
  buttonPrimary: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: colors.white,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: '0.75rem',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(15, 52, 96, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: '0 10px 25px rgba(15, 52, 96, 0.4)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
      transform: 'translate(-100%, -100%)',
      transition: 'transform 0.8s',
    },
    '&:hover::after': {
      transform: 'translate(0, 0)',
    }
  },
  
  // 3D Button
  button3D: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    color: colors.white,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: '0.75rem',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    transform: 'translateY(0)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: `0 4px 0 0 ${colors.primaryDark}, 0 8px 12px rgba(0, 0, 0, 0.1)`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 0 0 ${colors.primaryDark}, 0 12px 16px rgba(0, 0, 0, 0.15)`,
    },
    '&:active': {
      transform: 'translateY(2px)',
      boxShadow: `0 2px 0 0 ${colors.primaryDark}, 0 4px 8px rgba(0, 0, 0, 0.1)`,
    }
  },
  
  // Glass input - Enhanced with better visual feedback
  glassInput: {
    width: '100%',
    padding: spacing.md,
    borderRadius: '0.75rem',
    border: `1px solid rgba(255, 255, 255, 0.4)`,
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: colors.textPrimary,
    transition: 'all 0.3s ease',
    fontSize: '0.875rem',
    outline: 'none',
    '&::placeholder': {
      color: 'rgba(100, 116, 139, 0.7)',
    },
    '&:focus': {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryLight}25, ${colors.neonGlow}`,
      transform: 'translateY(-2px)',
    },
  },
  
  // Labels
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: '0.02em',
  },
  
  // Section headers with 3D effect
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderBottom: `1px solid ${colors.divider}`,
    paddingBottom: spacing.sm,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-1px',
      left: '0',
      width: '50px',
      height: '3px',
      background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
      borderRadius: '3px',
    }
  },
  
  // Page container with dynamic background
  pageContainer: {
    minHeight: '100vh',
    width: '100%',
    background: `linear-gradient(135deg, ${colors.backgroundAlt} 0%, ${colors.background} 50%, ${colors.backgroundAlt} 100%)`,
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    padding: spacing.md,
  },
  
  // Full width container
  fullWidthContainer: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    padding: `${spacing.lg} ${spacing.md}`,
  },
  
  // Dashboard grid layout
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: spacing.xl,
    padding: spacing.lg,
    width: '100%',
    perspective: '1000px', // Adds 3D perspective to the grid
  },
  
  // Data table with modern styling
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 12px',
  },
  
  tableHeader: {
    textAlign: 'left',
    padding: spacing.md,
    color: colors.textSecondary,
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  
  tableRow: {
    background: colors.glassBackground,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.01)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
    },
  },
  
  tableCell: {
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: '0.875rem',
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease',
    '&:first-child': {
      borderTopLeftRadius: '0.75rem',
      borderBottomLeftRadius: '0.75rem',
      borderLeft: `1px solid ${colors.border}`,
    },
    '&:last-child': {
      borderTopRightRadius: '0.75rem',
      borderBottomRightRadius: '0.75rem',
      borderRight: `1px solid ${colors.border}`,
    },
  },
  
  // Icon button with 3D effect
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.white,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-3px) scale(1.1)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  
  // Neumorphic component style
  neumorphic: {
    background: colors.backgroundAlt,
    boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
    borderRadius: '20px',
    border: 'none',
    padding: spacing.lg,
  }
};

// Add global styles with updated fonts and icon library
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Satoshi:wght@400;500;700&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
  @import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.background};
    color: ${colors.textPrimary};
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${typography.displayFont};
    margin-top: 0;
  }
  
  code, pre {
    font-family: ${typography.monoFont};
  }
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease, transform 0.2s ease;
    display: inline-block;
  }
  
  a:hover {
    color: ${colors.primaryLight};
    transform: translateY(-2px);
  }
  
  /* Fancy link underline effect */
  a.fancy {
    position: relative;
    text-decoration: none;
    display: inline-block;
  }
  
  a.fancy::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
    transform-origin: bottom right;
    transition: transform 0.3s ease-out;
  }
  
  a.fancy:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spinner {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
  }
  
  /* Glass effect - Enhanced */
  .glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .glass::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
    transform: rotate(30deg);
    pointer-events: none;
  }
  
  .glass-dark {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(15, 23, 42, 0.2);
    color: white;
  }
  
  /* Animated gradient background */
  .gradient-bg {
    background: linear-gradient(-45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.info});
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* 3D Card Effect */
  .card-3d {
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: transform 0.3s ease;
  }
  
  .card-3d:hover {
    transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  }
  
  /* Floating animation */
  .float {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }
  
  /* Shimmer effect */
  .shimmer {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: ${colors.shimmerGradient};
    animation: shimmer 2.5s infinite;
  }
  
  @keyframes shimmer {
    100% { left: 150%; }
  }
  
  /* Neon glow effect */
  .neon-glow {
    box-shadow: ${colors.neonGlow};
  }
  
  /* Parallax effect */
  .parallax {
    transition: transform 0.2s ease;
    transform-style: preserve-3d;
    will-change: transform;
  }
  
  /* Icon styles */
  .ri, .bx {
    vertical-align: middle;
    line-height: 1;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.8);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.5);
    border-radius: 10px;
    transition: background 0.3s ease;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.7);
  }
`;

// Custom button hover effect styles - Enhanced
export const buttonHoverStyles = `
  button {
    position: relative;
    overflow: hidden;
  }
  
  button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  button:hover::after {
    transform: translateX(0);
  }
  
  button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(15, 52, 96, 0.2);
  }
  
  button:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(15, 52, 96, 0.1);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .button-3d {
    transform: translateY(0);
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 0 0 ${colors.primaryDark}, 0 8px 12px rgba(0, 0, 0, 0.1);
  }
  
  .button-3d:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 0 ${colors.primaryDark}, 0 12px 16px rgba(0, 0, 0, 0.15);
  }
  
  .button-3d:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 0 ${colors.primaryDark}, 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Utility function to create style objects for inline style application
export const createStyles = (styles: any) => {
  return styles;
};

// 3D transforms helper functions
export const transform3D = {
  // Apply parallax effect based on mouse position
  applyParallax: (event: any, element: HTMLElement, depth: number = 20) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = element.getBoundingClientRect();
    
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    element.style.transform = `
      rotateY(${x * depth}deg) 
      rotateX(${y * -depth}deg)
      translateZ(10px)
    `;
  },
  
  // Reset transform to original position
  resetTransform: (element: HTMLElement) => {
    element.style.transform = `
      rotateY(0deg) 
      rotateX(0deg)
      translateZ(0px)
    `;
  }
}; 