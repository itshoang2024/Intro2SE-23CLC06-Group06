import api from "../../lib/api";

const reviewService = {
  // 1. Get lists that have due words
  getListsWithDueWords: async () => {
    const response = await api.get("/revision/lists/due");
    return response.data;
  },

  // 2. Get all due words grouped by list
  getDueWords: async () => {
    const response = await api.get("/revision/due");
    return response.data;
  },

  // 3. Get current active revision session status
  getSessionStatus: async () => {
    const response = await api.get("/revision/sessions/status");
    return response.data;
  },

  // 4. Start a new revision session
  startSession: async ({ listId, sessionType }) => {
    const response = await api.post("/revision/sessions/start", {
      listId,
      sessionType,
    });
    return response.data;
  },

  // 5. Submit result for a word during a session
  submitResult: async ({ sessionId, wordId, result }) => {
    const response = await api.post(`/revision/sessions/${sessionId}/submit`, {
      wordId,
      result,
    });
    return response.data;
  },

  // 6. End the current revision session and get summary
  endSession: async (sessionId) => {
    const response = await api.post(`/revision/sessions/${sessionId}/end`);
    return response.data;
  },
};

export default reviewService;
