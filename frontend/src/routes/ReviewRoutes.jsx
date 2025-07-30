import {
    Review,
    Flashcard
} from "../pages/Review";

const reviewRoutes = [
  {
    path: "/review/:listId",
    element: <Review />
  },
  {
    path: "/review/:listId/flashcard",
    element: <Flashcard />
  }
];

export default reviewRoutes;