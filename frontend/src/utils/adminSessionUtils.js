import { toast } from 'react-toastify';
import authService from '../services/Auth/authService';

// Admin session configuration
const ADMIN_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const SESSION_WARNING_THRESHOLD = 15 * 60 * 1000; // 15 minutes before expiry
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute

class AdminSessionManager {
  constructor() {
    this.sessionCheckInterval = null;
    this.warningShown = false;
    this.callbacks = {
      onSessionExpired: [],
      onSessionWarning: [],
      onSessionExtended: []
    };
  }

  // Initialize session monitoring
  initialize() {
    this.startSessionMonitoring();
    this.bindActivityListeners();
  }

  // Destroy session monitoring
  destroy() {
    this.stopSessionMonitoring();
    this.unbindActivityListeners();
  }

  // Start the session check interval
  startSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }

    this.sessionCheckInterval = setInterval(() => {
      this.checkSessionStatus();
    }, SESSION_CHECK_INTERVAL);
  }

  // Stop the session check interval
  stopSessionMonitoring() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  // Check current session status
  checkSessionStatus() {
    const expiryTime = this.getSessionExpiry();
    
    if (!expiryTime) {
      return { status: 'no_session' };
    }

    const now = Date.now();
    const timeRemaining = expiryTime - now;

    if (timeRemaining <= 0) {
      // Session expired
      this.handleSessionExpired();
      return { status: 'expired' };
    } else if (timeRemaining <= SESSION_WARNING_THRESHOLD && !this.warningShown) {
      // Session expiring soon
      this.handleSessionWarning(timeRemaining);
      return { status: 'warning', timeRemaining };
    }

    return { status: 'active', timeRemaining };
  }

  // Get session expiry time from storage
  getSessionExpiry() {
    const expiry = sessionStorage.getItem('adminSessionExpiry');
    return expiry ? parseInt(expiry) : null;
  }

  // Set session expiry time
  setSessionExpiry(expiryTime) {
    sessionStorage.setItem('adminSessionExpiry', expiryTime.toString());
    this.warningShown = false;
  }

  // Remove session expiry
  clearSessionExpiry() {
    sessionStorage.removeItem('adminSessionExpiry');
    this.warningShown = false;
  }

  // Create new admin session
  createSession() {
    const expiryTime = Date.now() + ADMIN_SESSION_DURATION;
    this.setSessionExpiry(expiryTime);
    this.initialize();
    return expiryTime;
  }

  // Extend current session
  extendSession() {
    const newExpiryTime = Date.now() + ADMIN_SESSION_DURATION;
    this.setSessionExpiry(newExpiryTime);
    this.warningShown = false;
    
    toast.success('Admin session extended');
    this.triggerCallbacks('onSessionExtended', newExpiryTime);
    
    return newExpiryTime;
  }

  // End admin session
  endSession() {
    this.clearSessionExpiry();
    this.destroy();
    this.triggerCallbacks('onSessionExpired');
  }

  // Handle session expiry
  handleSessionExpired() {
    this.clearSessionExpiry();
    this.destroy();
    
    toast.error('Admin session expired. You have been logged out of the admin panel.');
    this.triggerCallbacks('onSessionExpired');
  }

  // Handle session warning
  handleSessionWarning(timeRemaining) {
    this.warningShown = true;
    const minutes = Math.ceil(timeRemaining / 60000);
    
    toast.warning(
      `Admin session expires in ${minutes} minute${minutes !== 1 ? 's' : ''}. Click to extend session.`,
      {
        autoClose: false,
        onClick: () => this.extendSession()
      }
    );
    
    this.triggerCallbacks('onSessionWarning', timeRemaining);
  }

  // Bind user activity listeners to auto-extend session
  bindActivityListeners() {
    this.activityHandler = () => this.handleUserActivity();
    
    // Listen for user activity
    document.addEventListener('mousedown', this.activityHandler);
    document.addEventListener('keydown', this.activityHandler);
    document.addEventListener('scroll', this.activityHandler);
    document.addEventListener('touchstart', this.activityHandler);
  }

  // Unbind activity listeners
  unbindActivityListeners() {
    if (this.activityHandler) {
      document.removeEventListener('mousedown', this.activityHandler);
      document.removeEventListener('keydown', this.activityHandler);
      document.removeEventListener('scroll', this.activityHandler);
      document.removeEventListener('touchstart', this.activityHandler);
    }
  }

  // Handle user activity
  handleUserActivity() {
    const sessionStatus = this.checkSessionStatus();
    
    // Auto-extend session if it's in warning period and user is active
    if (sessionStatus.status === 'warning' && sessionStatus.timeRemaining > 0) {
      this.extendSession();
    }
  }

  // Add callback for session events
  addEventListener(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  // Remove callback for session events
  removeEventListener(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  // Trigger callbacks for an event
  triggerCallbacks(event, ...args) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  // Get time remaining in session
  getTimeRemaining() {
    const expiryTime = this.getSessionExpiry();
    if (!expiryTime) return 0;
    
    const remaining = expiryTime - Date.now();
    return Math.max(0, remaining);
  }

  // Format time remaining as string
  formatTimeRemaining() {
    const remaining = this.getTimeRemaining();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Check if session is valid
  isSessionValid() {
    const expiryTime = this.getSessionExpiry();
    return expiryTime && Date.now() < expiryTime;
  }

  // Validate admin token with server
  async validateAdminToken() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Test admin endpoint access
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/teacher-requests/pending?limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        throw new Error('Admin access denied');
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Admin token validation failed:', error);
      return false;
    }
  }

  // Force refresh admin token
  async refreshAdminAccess() {
    try {
      // First refresh the auth token
      await authService.refreshAccessToken();
      
      // Then validate admin access
      const isValid = await this.validateAdminToken();
      
      if (isValid) {
        this.extendSession();
        return true;
      } else {
        this.handleSessionExpired();
        return false;
      }
    } catch (error) {
      console.error('Failed to refresh admin access:', error);
      this.handleSessionExpired();
      return false;
    }
  }
}

// Create singleton instance
const adminSessionManager = new AdminSessionManager();

// Utility functions for easy access
export const adminSessionUtils = {
  // Initialize session management
  init: () => adminSessionManager.initialize(),
  
  // Destroy session management
  destroy: () => adminSessionManager.destroy(),
  
  // Create new admin session
  createSession: () => adminSessionManager.createSession(),
  
  // Extend current session
  extendSession: () => adminSessionManager.extendSession(),
  
  // End admin session
  endSession: () => adminSessionManager.endSession(),
  
  // Check if session is valid
  isValid: () => adminSessionManager.isSessionValid(),
  
  // Get time remaining
  getTimeRemaining: () => adminSessionManager.getTimeRemaining(),
  
  // Format time remaining
  formatTimeRemaining: () => adminSessionManager.formatTimeRemaining(),
  
  // Get session status
  getStatus: () => adminSessionManager.checkSessionStatus(),
  
  // Validate admin token
  validateToken: () => adminSessionManager.validateAdminToken(),
  
  // Refresh admin access
  refreshAccess: () => adminSessionManager.refreshAdminAccess(),
  
  // Add event listener
  addEventListener: (event, callback) => adminSessionManager.addEventListener(event, callback),
  
  // Remove event listener
  removeEventListener: (event, callback) => adminSessionManager.removeEventListener(event, callback)
};

export default adminSessionUtils;