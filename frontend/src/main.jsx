import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppProviders from "./AppProviders.jsx";

import authRoutes from "./routes/AuthRoutes";
import vocabularyRoutes from "./routes/VocabularyRoutes.jsx";
import classroomRoutes from "./routes/ClassroomRoutes.jsx";
import userRoutes from "./routes/UserRoutes.jsx";

const router = createBrowserRouter([
  ...authRoutes,
  ...vocabularyRoutes,
  ...classroomRoutes,
  ...userRoutes,
]);

createRoot(document.getElementById("root")).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
