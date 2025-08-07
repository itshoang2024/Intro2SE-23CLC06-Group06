import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../services/Admin/adminAuthContext';
import adminSessionUtils from '../../utils/adminSessionUtils';

const AdminSessionStatus = ({ className = '' }) => {
  const { isAdmin, adminSessionExpiry, extendAdminSession, logoutAdmin } = useAdminAuth();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showExtendOption, setShowExtendOption] = useState(false);

  useEffect(() => {
    if (!isAdmin || !adminSessionExpiry) {
      setTimeRemaining('');
      return;
    }

    const updateTimeRemaining = () => {
      const remaining = adminSessionExpiry - Date.now();
      
      if (remaining <= 0) {
        setTimeRemaining('Expired');
        setShowExtendOption(false);
        return;
      }

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      
      // Show extend option if less than 15 minutes remaining
      setShowExtendOption(remaining <= 15 * 60 * 1000);
      
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    // Update immediately
    updateTimeRemaining();

    // Update every minute
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [isAdmin, adminSessionExpiry]);

  const handleExtendSession = () => {
    extendAdminSession();
    setShowExtendOption(false);
  };

  const handleEndSession = () => {
    logoutAdmin();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className={`admin-session-status ${className}`}>
      <div className="admin-session-status__info">
        <div className="admin-session-status__icon">
          <span className="admin-badge">Admin</span>
        </div>
        <div className="admin-session-status__details">
          <div className="admin-session-status__time">
            Session: {timeRemaining || 'Active'}
          </div>
          {showExtendOption && (
            <div className="admin-session-status__actions">
              <button 
                onClick={handleExtendSession}
                className="admin-session-status__extend"
                title="Extend session by 2 hours"
              >
                Extend
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="admin-session-status__controls">
        <button 
          onClick={handleEndSession}
          className="admin-session-status__logout"
          title="End admin session"
        >
          Exit Admin
        </button>
      </div>
    </div>
  );
};

export default AdminSessionStatus;