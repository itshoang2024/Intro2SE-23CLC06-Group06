import { element } from "prop-types"
import { AdminTeacherVerification, TeacherRequest, AdminUsers, AdminDashboard, AdminContent } from "../pages/Admin"

const adminRoutes = [
    { path: "/admin-teacher-verification", element: <AdminTeacherVerification /> },
    { path: "/teacher-request", element: <TeacherRequest /> },
    { path: "/admin-users", element: <AdminUsers /> },
    { path: "/admin-dashboard", element: <AdminDashboard /> },
    { path: "/admin-content", element: <AdminContent /> },
]
export default adminRoutes