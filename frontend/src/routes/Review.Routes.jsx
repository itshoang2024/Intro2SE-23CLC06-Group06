import { ReviewWithSR, StudyWithFlashcard, SessionSummary } from "../pages/Review";

const reviewRoutes = [
  {
    path: "/review/:listId",
    element: <ReviewWithSR />,
  },
  {
    path: "/review/:listId/flashcard",
    element: <StudyWithFlashcard />,
  },
  {
    path: "/review/session/:sessionId",
    element: <StudyWithFlashcard />,
  },
  {
    path: "/review/:listId/summary",
    element: <SessionSummary />,
  },
  {
    path: "/review/session/:sessionId/summary",
    element: <SessionSummary />,
  },
];

export default reviewRoutes;