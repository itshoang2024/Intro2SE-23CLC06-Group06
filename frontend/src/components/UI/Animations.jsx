import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for consistent animations across the app
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.8, y: -50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: -50 },
  transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// Animated components
export const AnimatedDiv = motion.div;
export const AnimatedSpan = motion.span;
export const AnimatedButton = motion.button;
export const AnimatedSection = motion.section;
export const AnimatedHeader = motion.header;
export const AnimatedMain = motion.main;
export const AnimatedNav = motion.nav;
export const AnimatedUL = motion.ul;
export const AnimatedLI = motion.li;

// Reusable animated components
export const FadeInUp = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInDown = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: -100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, ...props }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={staggerChildren}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, ...props }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Page wrapper with animation
export const PageWrapper = ({ children, ...props }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated modal wrapper
export const AnimatedModal = ({ children, isOpen, ...props }) => (
  <motion.div
    initial="initial"
    animate={isOpen ? "animate" : "exit"}
    variants={modalVariants}
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedBackdrop = ({ children, isOpen, ...props }) => (
  <motion.div
    initial="initial"
    animate={isOpen ? "animate" : "exit"}
    variants={backdropVariants}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover animation wrapper
export const HoverLift = ({ children, ...props }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const HoverScale = ({ children, scale = 1.05, ...props }) => (
  <motion.div
    whileHover={{ scale, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Loading animation component
export const LoadingSpinner = ({ size = 24, color = "#007bff", ...props }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    style={{
      width: size,
      height: size,
      border: `2px solid ${color}33`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%"
    }}
    {...props}
  />
);

// Attention seeking animations
export const Pulse = ({ children, ...props }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Bounce = ({ children, ...props }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 1, repeat: Infinity }}
    {...props}
  >
    {children}
  </motion.div>
);

export const Shake = ({ children, trigger = false, ...props }) => (
  <motion.div
    animate={trigger ? { x: [-10, 10, -10, 10, 0] } : {}}
    transition={{ duration: 0.5 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Text animation components
export const TypewriterText = ({ text, delay = 0, ...props }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    {...props}
  >
    {text.split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + index * 0.05 }}
      >
        {char}
      </motion.span>
    ))}
  </motion.span>
);

export const CountUp = ({ from = 0, to, duration = 1, ...props }) => {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    const increment = (to - from) / (duration * 60); // 60fps
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= to) {
          clearInterval(timer);
          return to;
        }
        return next;
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {Math.floor(count)}
    </motion.span>
  );
};

// Form animation components
export const AnimatedInput = ({ children, ...props }) => (
  <motion.div
    whileFocus={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const InteractiveButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.button>
);

// List animation components
export const AnimatedList = ({ children, ...props }) => (
  <motion.ul
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
    {...props}
  >
    {children}
  </motion.ul>
);

export const AnimatedListItem = ({ children, ...props }) => (
  <motion.li
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.li>
);

// Navigation animations
export const NavItemAnimation = ({ children, ...props }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Card animations
export const AnimatedCard = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export default {
  FadeInUp,
  FadeIn,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  PageWrapper,
  AnimatedModal,
  AnimatedBackdrop,
  HoverLift,
  HoverScale,
  LoadingSpinner,
  Pulse,
  Bounce,
  Shake,
  TypewriterText,
  CountUp,
  AnimatedInput,
  InteractiveButton,
  AnimatedList,
  AnimatedListItem,
  NavItemAnimation,
  AnimatedCard
};
