import { lazy, Suspense } from "react";

const Profile = lazy(() => import("../pages/User/Profile"));
const LearningStatistics = lazy(() => import("../pages/User/LearningStatistics"));

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
      fontSize: "1rem",
      color: "#666",
    }}
  >
    Loading user profile...
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const userRoutes = [
  { path: "profile", element: withSuspense(Profile) },
  { path: "statistics", element: withSuspense(LearningStatistics) }
];

export default userRoutes;
