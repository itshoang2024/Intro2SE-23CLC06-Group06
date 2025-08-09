// Export all animation components and utilities
export * from './Animations.jsx';
export * from './LoadingAndProgress.jsx';

// Re-export commonly used animations with simpler names
export { 
  FadeInUp as Reveal,
  ScaleIn as Zoom,
  SlideInLeft as SlideLeft,
  SlideInRight as SlideRight,
  HoverScale as Hover,
  InteractiveButton as Button,
  AnimatedCard as Card,
  LoadingSpinner as Spinner,
  PageWrapper as Page
} from './Animations.jsx';

export {
  SkeletonText as TextSkeleton,
  SkeletonCard as CardSkeleton,
  PulseLoader as Pulse,
  DotsLoader as Dots,
  ScrollReveal as Reveal
} from './LoadingAndProgress.jsx';
