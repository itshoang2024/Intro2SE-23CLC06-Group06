import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../services/Auth/authContext';
import { useAdminAuth } from '../../services/Admin/adminAuthContext';

const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();

  useEffect(() => {
    // Wait for both auth contexts to finish loading
    if (authLoading || adminLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast.error('Please log in to access the admin panel');
      navigate('/signin', {
        state: { from: location.pathname }
      });
      return;
    }

    // Check if user has admin role
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, location.pathname]);

  // Show loading state while checking authentication
  if (authLoading || adminLoading) {
    return (
      <div className="admin-route-guard-loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <div className="loading-text">
            <h3>Verifying Admin Access</h3>
            <p>Please wait while we verify your credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or not admin
  if (!user || !isAdmin) {
    return null;
  }

  // Render protected content
  return children;
};

export default AdminRouteGuard;