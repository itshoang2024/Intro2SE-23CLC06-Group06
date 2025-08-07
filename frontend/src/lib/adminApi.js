import api from './api';
import adminSessionUtils from '../utils/adminSessionUtils';
import { toast } from 'react-toastify';

// Create a specialized admin API client
class AdminApiClient {
  constructor() {
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Add admin-specific request interceptor
    api.interceptors.request.use(
      (config) => {
        // Check if this is an admin endpoint
        if (this.isAdminEndpoint(config.url)) {
          // Verify admin session is still valid
          if (!adminSessionUtils.isValid()) {
            adminSessionUtils.endSession();
            return Promise.reject(new Error('Admin session expired'));
          }

          // Extend session on admin activity
          if (this.shouldExtendSession()) {
            adminSessionUtils.extendSession();
          }

          // Add admin-specific headers if needed
          config.headers['X-Admin-Request'] = 'true';
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add admin-specific response interceptor
    api.interceptors.response.use(
      (response) => {
        // Handle successful admin responses
        if (this.isAdminEndpoint(response.config.url)) {
          this.handleAdminSuccess(response);
        }
        return response;
      },
      async (error) => {
        // Handle admin-specific errors
        if (this.isAdminEndpoint(error.config?.url)) {
          return this.handleAdminError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  // Check if URL is an admin endpoint
  isAdminEndpoint(url) {
    return url && url.includes('/admin/');
  }

  // Check if session should be extended (limit to once every 5 minutes)
  shouldExtendSession() {
    const lastExtension = sessionStorage.getItem('lastAdminSessionExtension');
    const now = Date.now();
    
    if (!lastExtension || (now - parseInt(lastExtension)) > 5 * 60 * 1000) {
      sessionStorage.setItem('lastAdminSessionExtension', now.toString());
      return true;
    }
    
    return false;
  }

  // Handle successful admin responses
  handleAdminSuccess(response) {
    // Log admin actions for audit (in development)
    if (import.meta.env.MODE === 'development') {
      console.log('Admin API Success:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Handle admin-specific errors
  async handleAdminError(error) {
    const originalRequest = error.config;

    // Handle admin authorization errors
    if (error.response?.status === 403) {
      if (error.response.data?.message?.includes('admin')) {
        toast.error('Admin access denied. Your privileges may have been revoked.');
        adminSessionUtils.endSession();
        return Promise.reject(new Error('Admin access denied'));
      }
    }

    // Handle admin session timeout
    if (error.response?.status === 401 && !originalRequest._adminRetry) {
      originalRequest._adminRetry = true;

      try {
        // Try to refresh admin access
        const refreshed = await adminSessionUtils.refreshAccess();
        
        if (refreshed) {
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error('Admin session refresh failed');
        }
      } catch (refreshError) {
        toast.error('Admin session expired. Please log in again.');
        adminSessionUtils.endSession();
        return Promise.reject(refreshError);
      }
    }

    // Handle admin-specific server errors
    if (error.response?.status >= 500) {
      toast.error('Admin service temporarily unavailable. Please try again.');
      
      // Log admin errors for debugging
      console.error('Admin API Error:', {
        url: originalRequest.url,
        method: originalRequest.method,
        status: error.response.status,
        message: error.response.data?.message,
        timestamp: new Date().toISOString()
      });
    }

    // Handle rate limiting for admin endpoints
    if (error.response?.status === 429) {
      toast.warning('Too many admin requests. Please wait before trying again.');
    }

    return Promise.reject(error);
  }

  // Make admin API request with additional error handling
  async makeAdminRequest(config) {
    try {
      // Validate admin session before making request
      if (!adminSessionUtils.isValid()) {
        throw new Error('Admin session expired');
      }

      const response = await api(config);
      return response;
    } catch (error) {
      // Add admin context to error
      if (this.isAdminEndpoint(config.url)) {
        error.isAdminError = true;
        error.adminContext = {
          endpoint: config.url,
          method: config.method,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  // Specialized methods for common admin operations

  // Get with admin session validation
  async get(url, config = {}) {
    return this.makeAdminRequest({
      method: 'get',
      url,
      ...config
    });
  }

  // Post with admin session validation
  async post(url, data, config = {}) {
    return this.makeAdminRequest({
      method: 'post',
      url,
      data,
      ...config
    });
  }

  // Put with admin session validation
  async put(url, data, config = {}) {
    return this.makeAdminRequest({
      method: 'put',
      url,
      data,
      ...config
    });
  }

  // Delete with admin session validation and confirmation
  async delete(url, config = {}) {
    return this.makeAdminRequest({
      method: 'delete',
      url,
      ...config
    });
  }

  // Patch with admin session validation
  async patch(url, data, config = {}) {
    return this.makeAdminRequest({
      method: 'patch',
      url,
      data,
      ...config
    });
  }

  // Bulk operations with progress tracking
  async bulkOperation(operations, onProgress) {
    const results = [];
    const total = operations.length;

    for (let i = 0; i < operations.length; i++) {
      try {
        const result = await this.makeAdminRequest(operations[i]);
        results.push({ success: true, result, index: i });
      } catch (error) {
        results.push({ success: false, error, index: i });
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, total, results[i]);
      }
    }

    return results;
  }

  // Download admin reports/exports
  async downloadFile(url, filename, config = {}) {
    try {
      const response = await this.makeAdminRequest({
        method: 'get',
        url,
        responseType: 'blob',
        ...config
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'admin_export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`File downloaded: ${filename}`);
      return true;
    } catch (error) {
      toast.error('Failed to download file');
      throw error;
    }
  }

  // Upload admin files
  async uploadFile(url, file, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeAdminRequest({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config
    });
  }

  // Get admin health check
  async healthCheck() {
    try {
      const response = await this.get('/admin/health');
      return response.data;
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
}

// Create singleton instance
const adminApi = new AdminApiClient();

export default adminApi;