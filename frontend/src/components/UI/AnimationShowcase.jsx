import React, { useState } from 'react';
import {
  PageWrapper,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  InteractiveButton,
  HoverScale,
  HoverLift,
  AnimatedCard,
  LoadingSpinner,
  Pulse,
  Bounce,
  Shake,
  TypewriterText,
  CountUp,
  ScrollReveal,
  FloatingActionButton,
  AnimatedList,
  AnimatedListItem
} from '../UI/Animations.jsx';
import {
  ProgressBar,
  CircularProgress,
  DotsLoader,
  PulseLoader,
  SkeletonText,
  SkeletonCard,
  Toast,
  ToastContainer
} from '../UI/LoadingAndProgress.jsx';

const AnimationShowcase = () => {
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shakeDemo, setShakeDemo] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const triggerShake = () => {
    setShakeDemo(true);
    setTimeout(() => setShakeDemo(false), 500);
  };

  return (
    <PageWrapper>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <FadeInUp>
          <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>
            <TypewriterText text="🎨 Animation Showcase" />
          </h1>
        </FadeInUp>

        {/* Entry Animations Section */}
        <ScrollReveal animation="fadeInUp">
          <section style={{ marginBottom: '4rem' }}>
            <h2>Entry Animations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <AnimatedCard>
                <FadeInUp delay={0.1}>
                  <h3>Fade In Up</h3>
                  <p>Smooth fade and slide from bottom</p>
                </FadeInUp>
              </AnimatedCard>
              
              <AnimatedCard>
                <SlideInLeft delay={0.2}>
                  <h3>Slide In Left</h3>
                  <p>Slides in from the left side</p>
                </SlideInLeft>
              </AnimatedCard>
              
              <AnimatedCard>
                <SlideInRight delay={0.3}>
                  <h3>Slide In Right</h3>
                  <p>Slides in from the right side</p>
                </SlideInRight>
              </AnimatedCard>
              
              <AnimatedCard>
                <ScaleIn delay={0.4}>
                  <h3>Scale In</h3>
                  <p>Scales up from small to normal</p>
                </ScaleIn>
              </AnimatedCard>
            </div>
          </section>
        </ScrollReveal>

        {/* Interactive Elements */}
        <ScrollReveal animation="fadeInLeft">
          <section style={{ marginBottom: '4rem' }}>
            <h2>Interactive Elements</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <InteractiveButton 
                onClick={() => setShowToast(true)}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}
              >
                Show Toast
              </InteractiveButton>

              <HoverScale scale={1.1}>
                <button style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px' 
                }}>
                  Hover Scale
                </button>
              </HoverScale>

              <HoverLift>
                <div style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#17a2b8', 
                  color: 'white', 
                  borderRadius: '8px' 
                }}>
                  Hover Lift
                </div>
              </HoverLift>

              <Shake trigger={shakeDemo}>
                <InteractiveButton 
                  onClick={triggerShake}
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px' 
                  }}
                >
                  Shake Me!
                </InteractiveButton>
              </Shake>
            </div>
          </section>
        </ScrollReveal>

        {/* Attention Seekers */}
        <ScrollReveal animation="fadeInRight">
          <section style={{ marginBottom: '4rem' }}>
            <h2>Attention Seekers</h2>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Pulse>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#ffc107', 
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  Pulsing Element
                </div>
              </Pulse>

              <Bounce>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#6f42c1', 
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  Bouncing Element
                </div>
              </Bounce>
            </div>
          </section>
        </ScrollReveal>

        {/* Loading States */}
        <ScrollReveal animation="zoomIn">
          <section style={{ marginBottom: '4rem' }}>
            <h2>Loading States</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <h3>Spinners</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <LoadingSpinner size={32} color="#007bff" />
                  <DotsLoader size="10px" color="#28a745" />
                  <PulseLoader size="12px" color="#dc3545" />
                </div>
              </div>

              <div>
                <h3>Progress Indicators</h3>
                <ProgressBar progress={progress} height="8px" showPercentage={true} />
                <div style={{ marginTop: '1rem' }}>
                  <CircularProgress progress={progress} size="60px" showPercentage={true} />
                </div>
              </div>

              <div>
                <h3>Skeleton Loading</h3>
                <SkeletonText width="80%" height="1rem" />
                <SkeletonText width="60%" height="1rem" />
                <SkeletonCard width="100%" height="100px" />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Staggered List */}
        <ScrollReveal animation="fadeInUp">
          <section style={{ marginBottom: '4rem' }}>
            <h2>Staggered Animations</h2>
            <AnimatedList style={{ listStyle: 'none', padding: 0 }}>
              {['First Item', 'Second Item', 'Third Item', 'Fourth Item'].map((item, index) => (
                <AnimatedListItem 
                  key={index}
                  style={{ 
                    padding: '1rem', 
                    margin: '0.5rem 0', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}
                >
                  {item}
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </section>
        </ScrollReveal>

        {/* Counter */}
        <ScrollReveal animation="fadeInUp">
          <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h2>Animated Counter</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007bff' }}>
              <CountUp from={0} to={1234} duration={3} />
            </div>
            <p>Users have joined our platform!</p>
          </section>
        </ScrollReveal>

        {/* Floating Action Button */}
        <FloatingActionButton 
          position="bottom-right"
          color="#007bff"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </FloatingActionButton>

        {/* Toast Notifications */}
        {showToast && (
          <ToastContainer position="top-right">
            <Toast 
              type="success"
              title="Animation Demo"
              message="This is a beautiful animated toast notification!"
              onClose={() => setShowToast(false)}
              autoClose={true}
              duration={3000}
            />
          </ToastContainer>
        )}

        {/* Footer */}
        <ScrollReveal animation="fadeInUp">
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            marginTop: '4rem'
          }}>
            <h3>🚀 Ready to Use!</h3>
            <p>All these animations are now available throughout your application.</p>
            <p>Check the Animation Guide for detailed documentation.</p>
          </div>
        </ScrollReveal>
      </div>
    </PageWrapper>
  );
};

export default AnimationShowcase;
