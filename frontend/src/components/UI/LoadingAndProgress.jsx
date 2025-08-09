import React from 'react';
import { motion } from 'framer-motion';

// Loading Skeleton Components
export const SkeletonText = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  ...props 
}) => (
  <motion.div
    className={`loading-skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: '4px',
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    {...props}
  />
);

export const SkeletonCard = ({ 
  width = '100%', 
  height = '200px', 
  className = '',
  children,
  ...props 
}) => (
  <motion.div
    className={`loading-skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius: '8px',
      padding: '1rem',
    }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SkeletonAvatar = ({ 
  size = '50px', 
  className = '',
  ...props 
}) => (
  <motion.div
    className={`loading-skeleton ${className}`}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
    }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);

// Enhanced Loading Spinners
export const PulseLoader = ({ 
  size = '12px', 
  color = '#007bff',
  className = '',
  ...props 
}) => (
  <div className={`pulse-loader ${className}`} {...props}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: '50%',
          margin: '0 2px',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

export const DotsLoader = ({ 
  size = '8px', 
  color = '#007bff',
  className = '',
  ...props 
}) => (
  <div className={`dots-loader ${className}`} style={{ display: 'flex', gap: '4px' }} {...props}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: '50%',
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

// Progress Indicators
export const ProgressBar = ({ 
  progress = 0, 
  height = '4px',
  color = '#007bff',
  backgroundColor = '#e0e0e0',
  className = '',
  showPercentage = false,
  ...props 
}) => (
  <div className={`progress-container ${className}`} {...props}>
    <div
      style={{
        width: '100%',
        height,
        backgroundColor,
        borderRadius: height,
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          height: '100%',
          backgroundColor: color,
          borderRadius: height,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    {showPercentage && (
      <motion.span
        style={{ fontSize: '0.8rem', marginTop: '4px', color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Math.round(progress)}%
      </motion.span>
    )}
  </div>
);

export const CircularProgress = ({ 
  progress = 0, 
  size = '50px',
  strokeWidth = '4px',
  color = '#007bff',
  backgroundColor = '#e0e0e0',
  showPercentage = false,
  className = '',
  ...props 
}) => {
  const radius = (parseInt(size) - parseInt(strokeWidth)) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`circular-progress ${className}`} {...props}>
      <svg width={size} height={size}>
        <circle
          cx={parseInt(size) / 2}
          cy={parseInt(size) / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={parseInt(size) / 2}
          cy={parseInt(size) / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          transform={`rotate(-90 ${parseInt(size) / 2} ${parseInt(size) / 2})`}
        />
      </svg>
      {showPercentage && (
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
};

// Notification/Toast Animations
export const ToastContainer = ({ children, position = 'top-right', ...props }) => {
  const positions = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        zIndex: 9999,
        ...positions[position],
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  autoClose = true,
  duration = 5000,
  ...props 
}) => {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <motion.div
      style={{
        background: 'white',
        border: `1px solid ${colors[type]}`,
        borderLeft: `4px solid ${colors[type]}`,
        borderRadius: '8px',
        padding: '12px 16px',
        margin: '8px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        maxWidth: '500px',
      }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {title && (
            <h4 style={{ margin: '0 0 4px 0', color: colors[type], fontSize: '0.9rem' }}>
              {title}
            </h4>
          )}
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
            {message}
          </p>
        </div>
        {onClose && (
          <motion.button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#999',
              padding: 0,
              marginLeft: '12px',
            }}
            whileHover={{ color: colors[type] }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// Parallax Effect Component
export const ParallaxContainer = ({ 
  children, 
  speed = 0.5, 
  className = '',
  ...props 
}) => {
  const [offsetY, setOffsetY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={`parallax-container ${className}`}
      style={{
        transform: `translateY(${offsetY * speed}px)`,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({ 
  children, 
  onClick,
  position = 'bottom-right',
  color = '#007bff',
  size = '56px',
  className = '',
  ...props 
}) => {
  const positions = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' },
  };

  return (
    <motion.button
      className={`floating-action-button ${className}`}
      onClick={onClick}
      style={{
        position: 'fixed',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...positions[position],
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)' 
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Scroll-triggered animations
export const ScrollReveal = ({ 
  children, 
  threshold = 0.1,
  animation = 'fadeInUp',
  delay = 0,
  ...props 
}) => {
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -60 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={animations[animation]}
      transition={{ duration: 0.6, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  PulseLoader,
  DotsLoader,
  ProgressBar,
  CircularProgress,
  ToastContainer,
  Toast,
  ParallaxContainer,
  FloatingActionButton,
  ScrollReveal,
};
