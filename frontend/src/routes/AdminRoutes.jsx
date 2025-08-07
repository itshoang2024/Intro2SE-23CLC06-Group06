import { lazy, Suspense } from "react";

const AdminTeacherVerification = lazy(() => import("../pages/Admin/AdminTeacherVerification"));
const TeacherRequest = lazy(() => import("../pages/Admin/TeacherRequest"));
const AdminUsers = lazy(() => import("../pages/Admin/AdminUsers"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));

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
    Loading admin panel...
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const adminRoutes = [
    { path: "/admin-teacher-verification", element: withSuspense(AdminTeacherVerification) },
    { path: "/teacher-request", element: withSuspense(TeacherRequest) },
    { path: "/admin-users", element: withSuspense(AdminUsers) },
    { path: "/admin-dashboard", element: withSuspense(AdminDashboard) },
];

export default adminRoutes;