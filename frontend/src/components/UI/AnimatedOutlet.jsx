import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';

const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={location.pathname}>
        <Outlet />
      </div>
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
