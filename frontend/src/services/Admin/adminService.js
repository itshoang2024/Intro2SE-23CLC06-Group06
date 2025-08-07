import adminApi from "../../lib/adminApi";
import { toast } from "react-toastify";

const adminService = {
  // Teacher Verification Services
  
  //1. Get All Pending Teacher Requests with pagination support
  getAllPendingTeacherRequest: async (page = 1, limit = 20, sortBy = 'created_at:asc') => {
    try {
      const res = await adminApi.get(`/admin/teacher-requests/pending?page=${page}&limit=${limit}&sortBy=${sortBy}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching pending teacher requests:', error);
      toast.error('Failed to load teacher requests');
      throw error;
    }
  },

  //2. Get a Specific Teacher Request
  getASpecificTeacherRequest: async (requestId) => {
    try {
      const res = await adminApi.get(`/admin/teacher-requests/${requestId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching teacher request:', error);
      toast.error('Failed to load teacher request details');
      throw error;
    }
  },

  //3. Approve a Teacher Request
  approveATeacherRequest: async (requestId, notes = '') => {
    try {
      const res = await adminApi.put(`/admin/teacher-requests/${requestId}/approve`, { notes });
      toast.success('Teacher request approved successfully');
      return res.data;
    } catch (error) {
      console.error('Error approving teacher request:', error);
      toast.error('Failed to approve teacher request');
      throw error;
    }
  },

  //4. Reject a Teacher Request
  rejectATeacherRequest: async (requestId, reason = '') => {
    try {
      const res = await adminApi.put(`/admin/teacher-requests/${requestId}/reject`, { reason });
      toast.success('Teacher request rejected');
      return res.data;
    } catch (error) {
      console.error('Error rejecting teacher request:', error);
      toast.error('Failed to reject teacher request');
      throw error;
    }
  },

  // Content Moderation Services

  //5. Get All Open Reports with enhanced pagination
  getAllOpenReports: async (page = 1, limit = 20, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });
      
      const res = await adminApi.get(`/admin/reports/open?${queryParams}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching open reports:', error);
      toast.error('Failed to load content reports');
      throw error;
    }
  },

  //6. Get a Specific Report
  getASpecificReport: async (reportId) => {
    try {
      const res = await adminApi.get(`/admin/reports/${reportId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report details');
      throw error;
    }
  },

  //7. Approve a Report (Delete the reported content)
  approveAReport: async (reportId, notes = '') => {
    try {
      const res = await adminApi.put(`/admin/reports/${reportId}/approve`, { notes });
      toast.success('Report approved and content removed');
      return res.data;
    } catch (error) {
      console.error('Error approving report:', error);
      toast.error('Failed to approve report');
      throw error;
    }
  },

  //8. Dismiss a Report (Keep the content)
  dismissAReport: async (reportId, notes = '') => {
    try {
      const res = await adminApi.put(`/admin/reports/${reportId}/dismiss`, { notes });
      toast.success('Report dismissed and content kept');
      return res.data;
    } catch (error) {
      console.error('Error dismissing report:', error);
      toast.error('Failed to dismiss report');
      throw error;
    }
  },

  // Bulk Operations

  //9. Bulk approve teacher requests
  bulkApproveTeacherRequests: async (requestIds, notes = '') => {
    try {
      const operations = requestIds.map(id => ({
        method: 'put',
        url: `/admin/teacher-requests/${id}/approve`,
        data: { notes }
      }));

      const results = await adminApi.bulkOperation(operations);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} teacher request${successCount > 1 ? 's' : ''} approved`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} request${failCount > 1 ? 's' : ''} failed to approve`);
      }

      return results;
    } catch (error) {
      console.error('Error in bulk approve:', error);
      toast.error('Bulk approve operation failed');
      throw error;
    }
  },

  //10. Bulk reject teacher requests
  bulkRejectTeacherRequests: async (requestIds, reason = '') => {
    try {
      const operations = requestIds.map(id => ({
        method: 'put',
        url: `/admin/teacher-requests/${id}/reject`,
        data: { reason }
      }));

      const results = await adminApi.bulkOperation(operations);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} teacher request${successCount > 1 ? 's' : ''} rejected`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} request${failCount > 1 ? 's' : ''} failed to reject`);
      }

      return results;
    } catch (error) {
      console.error('Error in bulk reject:', error);
      toast.error('Bulk reject operation failed');
      throw error;
    }
  },

  //11. Bulk process reports
  bulkProcessReports: async (actions) => {
    try {
      const operations = actions.map(({ reportId, action, notes }) => ({
        method: 'put',
        url: `/admin/reports/${reportId}/${action}`,
        data: { notes }
      }));

      const results = await adminApi.bulkOperation(operations);
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`${successCount} report${successCount > 1 ? 's' : ''} processed`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} report${failCount > 1 ? 's' : ''} failed to process`);
      }

      return results;
    } catch (error) {
      console.error('Error in bulk process reports:', error);
      toast.error('Bulk process operation failed');
      throw error;
    }
  },

  // Export and Download Services

  //12. Export teacher requests
  exportTeacherRequests: async (filters = {}, format = 'csv') => {
    try {
      const queryParams = new URLSearchParams({
        format,
        ...filters
      });
      
      const filename = `teacher_requests_${new Date().toISOString().split('T')[0]}.${format}`;
      await adminApi.downloadFile(`/admin/teacher-requests/export?${queryParams}`, filename);
      return true;
    } catch (error) {
      console.error('Error exporting teacher requests:', error);
      toast.error('Failed to export teacher requests');
      throw error;
    }
  },

  //13. Export reports
  exportReports: async (filters = {}, format = 'csv') => {
    try {
      const queryParams = new URLSearchParams({
        format,
        ...filters
      });
      
      const filename = `content_reports_${new Date().toISOString().split('T')[0]}.${format}`;
      await adminApi.downloadFile(`/admin/reports/export?${queryParams}`, filename);
      return true;
    } catch (error) {
      console.error('Error exporting reports:', error);
      toast.error('Failed to export reports');
      throw error;
    }
  },

  // Health and Monitoring

  //14. Check admin service health
  checkHealth: async () => {
    try {
      return await adminApi.healthCheck();
    } catch (error) {
      console.error('Admin health check failed:', error);
      return { status: 'error', error: error.message };
    }
  }
};

export default adminService;
