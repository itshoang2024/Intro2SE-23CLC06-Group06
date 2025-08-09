# Animation System Documentation

This comprehensive animation system provides a wide range of interactive animations and transitions for your React application using Framer Motion and CSS animations.

## 🚀 Quick Start

```jsx
import { FadeInUp, InteractiveButton, PageWrapper } from '@/components/UI/Animations';

function MyComponent() {
  return (
    <PageWrapper>
      <FadeInUp delay={0.2}>
        <h1>Welcome!</h1>
      </FadeInUp>
      <InteractiveButton onClick={handleClick}>
        Click me!
      </InteractiveButton>
    </PageWrapper>
  );
}
```

## 📚 Component Categories

### 1. Layout Animations

#### PageWrapper
Provides smooth page transitions with fade and slide effects.
```jsx
<PageWrapper>
  {/* Your page content */}
</PageWrapper>
```

#### StaggerContainer & StaggerItem
Creates staggered animations for lists and grids.
```jsx
<StaggerContainer>
  <StaggerItem>Item 1</StaggerItem>
  <StaggerItem>Item 2</StaggerItem>
  <StaggerItem>Item 3</StaggerItem>
</StaggerContainer>
```

### 2. Entry Animations

#### FadeInUp, FadeIn, SlideInLeft, SlideInRight, ScaleIn
Basic entry animations with customizable delays.
```jsx
<FadeInUp delay={0.1}>Content appears from bottom</FadeInUp>
<SlideInLeft delay={0.2}>Content slides from left</SlideInLeft>
<ScaleIn delay={0.3}>Content scales up</ScaleIn>
```

### 3. Interactive Components

#### InteractiveButton
Enhanced button with hover and tap animations.
```jsx
<InteractiveButton className="my-button" onClick={handleClick}>
  Click me!
</InteractiveButton>
```

#### HoverScale, HoverLift
Hover effects for any component.
```jsx
<HoverScale scale={1.1}>
  <img src="..." alt="..." />
</HoverScale>

<HoverLift>
  <div>This lifts on hover</div>
</HoverLift>
```

#### AnimatedCard
Card component with hover animations.
```jsx
<AnimatedCard>
  <h3>Card Title</h3>
  <p>Card content...</p>
</AnimatedCard>
```

### 4. Loading States

#### LoadingSpinner
Customizable spinning loader.
```jsx
<LoadingSpinner size={32} color="#007bff" />
```

#### PulseLoader, DotsLoader
Alternative loading animations.
```jsx
<PulseLoader size="12px" color="#007bff" />
<DotsLoader size="8px" color="#ff6b6b" />
```

#### Skeleton Components
Loading placeholders for content.
```jsx
<SkeletonText width="80%" height="1rem" />
<SkeletonCard width="100%" height="200px" />
<SkeletonAvatar size="50px" />
```

### 5. Progress Indicators

#### ProgressBar
Animated progress bar with optional percentage display.
```jsx
<ProgressBar 
  progress={75} 
  height="8px" 
  showPercentage={true}
  color="#10b981" 
/>
```

#### CircularProgress
Circular progress indicator.
```jsx
<CircularProgress 
  progress={60} 
  size="60px" 
  showPercentage={true}
  color="#3b82f6" 
/>
```

### 6. Attention Seekers

#### Pulse, Bounce, Shake
Attention-grabbing animations.
```jsx
<Pulse>
  <button>Important!</button>
</Pulse>

<Shake trigger={hasError}>
  <input className={hasError ? 'error' : ''} />
</Shake>
```

### 7. Modal & Overlay Animations

#### AnimatedModal, AnimatedBackdrop
Enhanced modal components with smooth transitions.
```jsx
<AnimatedBackdrop isOpen={isOpen}>
  <AnimatedModal isOpen={isOpen}>
    <h2>Modal Content</h2>
  </AnimatedModal>
</AnimatedBackdrop>
```

### 8. Text Animations

#### TypewriterText
Typewriter effect for text.
```jsx
<TypewriterText text="Hello, World!" delay={0.5} />
```

#### CountUp
Animated number counter.
```jsx
<CountUp from={0} to={100} duration={2} />
```

### 9. List Animations

#### AnimatedList, AnimatedListItem
Smooth animations for lists.
```jsx
<AnimatedList>
  <AnimatedListItem>Item 1</AnimatedListItem>
  <AnimatedListItem>Item 2</AnimatedListItem>
</AnimatedList>
```

### 10. Scroll-Based Animations

#### ScrollReveal
Trigger animations when elements come into view.
```jsx
<ScrollReveal animation="fadeInUp" threshold={0.3}>
  <div>Appears when scrolled into view</div>
</ScrollReveal>
```

#### ParallaxContainer
Parallax scrolling effect.
```jsx
<ParallaxContainer speed={0.5}>
  <img src="background.jpg" alt="Parallax background" />
</ParallaxContainer>
```

### 11. Floating Elements

#### FloatingActionButton
Floating action button with entrance animation.
```jsx
<FloatingActionButton 
  position="bottom-right"
  color="#007bff"
  onClick={handleAction}
>
  +
</FloatingActionButton>
```

### 12. Notifications

#### Toast, ToastContainer
Animated toast notifications.
```jsx
<ToastContainer position="top-right">
  <Toast 
    type="success" 
    title="Success!" 
    message="Operation completed successfully"
    onClose={handleClose}
  />
</ToastContainer>
```

## 🎨 CSS Animation Classes

Use these classes directly in your HTML/JSX:

### Basic Animations
- `.animate-fade-in` - Fade in effect
- `.animate-slide-up` - Slide up from bottom
- `.animate-slide-down` - Slide down from top
- `.animate-zoom-in` - Scale up effect
- `.animate-bounce-in` - Bounce entrance

### Hover Effects
- `.hover-lift` - Lift on hover
- `.hover-scale` - Scale on hover
- `.card-hover` - Card hover effect

### Button Effects
- `.btn-press` - Press down effect on click
- `.btn-ripple` - Ripple effect on click

### Transitions
- `.transition-fast` - Fast transitions (150ms)
- `.transition-normal` - Normal transitions (300ms)
- `.transition-slow` - Slow transitions (500ms)

### Delays
- `.delay-100` - 100ms animation delay
- `.delay-200` - 200ms animation delay
- `.delay-300` - 300ms animation delay

### Loading States
- `.loading-shimmer` - Shimmer loading effect
- `.loading-skeleton` - Skeleton loading effect
- `.loading-spinner` - Spinning loader

## 🛠️ SCSS Mixins

Use these mixins in your SCSS files:

```scss
// Hover effects
.my-card {
  @include card-hover;
}

.my-button {
  @include button-press;
  @include hover-scale(1.05);
}

// Transitions
.my-element {
  @include smooth-transition(all, 300ms, ease-out);
}

// Entry animations
.my-content {
  @include fade-in(500ms);
}

// Stagger animations
.my-list {
  @include stagger-children(0.1s);
}
```

## ⚙️ Configuration

### Animation Timing
The system uses predefined timing functions:
- `$ease-in-out`: cubic-bezier(0.4, 0, 0.2, 1)
- `$ease-out`: cubic-bezier(0, 0, 0.2, 1)
- `$bounce`: cubic-bezier(0.68, -0.55, 0.265, 1.55)

### Duration Variables
- `$duration-fast`: 150ms
- `$duration-normal`: 300ms
- `$duration-slow`: 500ms

## 🌐 Accessibility

The animation system respects user preferences:

```scss
@media (prefers-reduced-motion: reduce) {
  // All animations are reduced to minimal duration
  // for users who prefer reduced motion
}
```

## 🔧 Customization

### Custom Animation Variants
```jsx
const customVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -45 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.8, rotate: 45 }
};

<motion.div variants={customVariants}>
  Custom animation
</motion.div>
```

### Override Default Styles
```scss
// Override animation duration
.my-custom-animation {
  animation-duration: 1s !important;
}

// Disable animations for specific elements
.no-animation * {
  animation: none !important;
  transition: none !important;
}
```

## 🎯 Best Practices

1. **Performance**: Use CSS animations for simple transforms, Framer Motion for complex interactions
2. **Accessibility**: Always test with `prefers-reduced-motion`
3. **Consistency**: Use the predefined timing and easing functions
4. **Progressive Enhancement**: Ensure content is usable without animations
5. **Moderation**: Don't overuse animations - they should enhance, not distract

## 📱 Responsive Considerations

```scss
// Reduce animations on mobile for better performance
@media (max-width: 768px) {
  .animate-on-desktop {
    animation: none;
  }
}
```

## 🧪 Testing

Test your animations with:
- Different screen sizes
- Reduced motion preferences
- Slow network connections
- Touch devices
- Keyboard navigation

## 🔗 Related Files

- `/src/scss/_Animations.scss` - CSS animations and mixins
- `/src/components/UI/Animations.jsx` - React animation components
- `/src/components/UI/LoadingAndProgress.jsx` - Loading and progress components
- `/src/components/Providers/PageTransitionProvider.jsx` - Page transition handling
