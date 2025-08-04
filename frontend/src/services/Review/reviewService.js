import api from "../../lib/api";

const reviewService = {
  // Get lists with due words for review
  getListsWithDueWords: async () => {
    const res = await api.get("/review/lists/due");
    return res.data.data || [];
  },

  // Get due words for review
  getDueWords: async (params = {}) => {
    const res = await api.get("/review/due", { params });
    return res.data.data || [];
  },

  // Get active session status
  getActiveSessionStatus: async () => {
    const res = await api.get("/review/sessions/status");
    return res.data.data || null;
  },

  // Start a new review session
  startSession: async (data) => {
    const res = await api.post("/review/sessions/start", data);
    return res.data.data || {};
  },

  // Submit a review result for a word
  submitResult: async (sessionId, data) => {
    const res = await api.post(`/review/sessions/${sessionId}/submit`, data);
    return res.data.data || {};
  },

  // End a review session
  endSession: async (sessionId, data = {}) => {
    const res = await api.post(`/review/sessions/${sessionId}/end`, data);
    return res.data.data || {};
  },
};

export default reviewService;