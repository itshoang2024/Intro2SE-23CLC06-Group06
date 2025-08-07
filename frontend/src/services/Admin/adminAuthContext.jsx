import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../Auth/authService";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminSessionExpiry, setAdminSessionExpiry] = useState(null);
  const navigate = useNavigate();

  // Check if user has admin role
  const checkAdminRole = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // Check if user role is admin
      const isAdminUser = user.role === 'admin' || user.role === 'administrator';
      
      if (!isAdminUser) {
        setIsAdmin(false);
        // Don't show error here, let the redirect handler deal with it
        setLoading(false);
        return;
      }

      // Verify admin permissions with backend
      const token = authService.getToken();
      if (token) {
        try {
          // Test admin endpoint access
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/teacher-requests/pending?limit=1`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            setIsAdmin(true);
            // Set admin session expiry (2 hours from now)
            const expiry = Date.now() + (2 * 60 * 60 * 1000);
            setAdminSessionExpiry(expiry);
            sessionStorage.setItem('adminSessionExpiry', expiry.toString());
          } else if (response.status === 403) {
            setIsAdmin(false);
            toast.error("Access denied. Admin privileges required.");
          } else {
            throw new Error(`Failed to verify admin access: ${response.status}`);
          }
        } catch (error) {
          console.error('Error verifying admin access:', error);
          setIsAdmin(false);
          toast.error("Failed to verify admin access. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
    
    setLoading(false);
  }, [user]);

  // Check admin session expiry
  const checkAdminSessionExpiry = useCallback(() => {
    const storedExpiry = sessionStorage.getItem('adminSessionExpiry');
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      if (Date.now() > expiryTime) {
        // Admin session expired
        setAdminSessionExpiry(null);
        sessionStorage.removeItem('adminSessionExpiry');
        toast.warning("Admin session expired. Please re-authenticate.");
        return false;
      }
      setAdminSessionExpiry(expiryTime);
      return true;
    }
    return false;
  }, []);

  // Extend admin session
  const extendAdminSession = useCallback(() => {
    if (isAdmin) {
      const newExpiry = Date.now() + (2 * 60 * 60 * 1000);
      setAdminSessionExpiry(newExpiry);
      sessionStorage.setItem('adminSessionExpiry', newExpiry.toString());
    }
  }, [isAdmin]);

  // Force admin logout (clears admin session but keeps user session)
  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    setAdminSessionExpiry(null);
    sessionStorage.removeItem('adminSessionExpiry');
    toast.info("Admin session ended. Returning to main application.");
    navigate('/');
  }, [navigate]);

  // Redirect non-admin users
  const redirectIfNotAdmin = useCallback(() => {
    if (!loading && !authLoading && user && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate('/');
      return true;
    }
    return false;
  }, [loading, authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!authLoading) {
      // First check stored admin session
      const hasValidSession = checkAdminSessionExpiry();
      
      if (hasValidSession && user?.role === 'admin') {
        setIsAdmin(true);
        setLoading(false);
      } else {
        // Re-verify admin role
        checkAdminRole();
      }
    }
  }, [user, authLoading, checkAdminRole, checkAdminSessionExpiry]);

  // Auto-refresh admin verification every 30 minutes
  useEffect(() => {
    if (isAdmin) {
      const interval = setInterval(() => {
        checkAdminRole();
      }, 30 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAdmin, checkAdminRole]);

  // Check session expiry every minute
  useEffect(() => {
    if (isAdmin && adminSessionExpiry) {
      const interval = setInterval(() => {
        if (!checkAdminSessionExpiry()) {
          logoutAdmin();
        }
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAdmin, adminSessionExpiry, checkAdminSessionExpiry, logoutAdmin]);

  const contextValue = {
    isAdmin,
    loading,
    adminSessionExpiry,
    extendAdminSession,
    logoutAdmin,
    redirectIfNotAdmin,
    checkAdminRole
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Higher-order component to protect admin routes
export const withAdminAuth = (Component) => {
  return function AdminProtectedComponent(props) {
    const { isAdmin, loading, redirectIfNotAdmin } = useAdminAuth();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
      if (!loading && !authLoading) {
        redirectIfNotAdmin();
      }
    }, [loading, authLoading, redirectIfNotAdmin]);

    if (loading || authLoading) {
      return (
        <div className="admin-loading">
          <div className="admin-loading__spinner">
            <div className="spinner"></div>
          </div>
          <p>Verifying admin access...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="admin-error">
          <h2>Authentication Required</h2>
          <p>Please log in to access the admin panel.</p>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="admin-error">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};