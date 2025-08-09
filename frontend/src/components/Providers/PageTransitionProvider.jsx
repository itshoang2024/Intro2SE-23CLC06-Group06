import React from 'react';
import { AnimatePresence } from 'framer-motion';

const PageTransitionProvider = ({ children }) => {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {children}
    </AnimatePresence>
  );
};

export default PageTransitionProvider;
