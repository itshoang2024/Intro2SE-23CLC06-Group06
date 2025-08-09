import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "./Animations.jsx";

export default function LoadingCursor({ loading = false, showOverlay = false, message = "Loading..." }) {
  useEffect(() => {
    document.body.style.cursor = loading ? "progress" : "default";

    return () => {
      // Reset lại nếu component bị unmount
      document.body.style.cursor = "default";
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <LoadingSpinner size={40} color="#007bff" />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: '16px',
              color: '#666',
              fontSize: '14px',
            }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
