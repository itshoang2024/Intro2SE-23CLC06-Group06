import { element } from "prop-types"
import { AdminTeacherVerification, TeacherRequest, AdminUsers, AdminDashboard } from "../pages/Admin"

const adminRoutes = [
    { path: "/admin-teacher-verification", element: <AdminTeacherVerification /> },
    { path: "/teacher-request", element: <TeacherRequest /> },
    { path: "/admin-users", element: <AdminUsers /> },
    { path: "/admin-dashboard", element: <AdminDashboard /> },
]
export default adminRoutes