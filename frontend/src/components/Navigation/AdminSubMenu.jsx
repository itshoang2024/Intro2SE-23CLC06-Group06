import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../Providers/ToastProvider";

const tabs = [
  { name: "Dashboard", route: "/admin-dashboard" },
  {
    name: "Users",
    route:  "/admin-users",
    matchRoutes: [
      "/admin-users",
      "/teacher-request",
    ],
  },
  { name: "Content", route: "/admin-content" },
  { name: "Statistic", route: "/admin-statistics" },
];

export default function TeacherClassroomMenuTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const currentPath = location.pathname;

  const handleTabClick = (tab) => {
    if (tab.route === "/admin-statistics") {
      toast("Feature is coming soon", "success");
      return;
    }
    navigate(tab.route);
  };

  return (
    <div className="sub-menu-tabs">
      <div className="tab-list">
        {tabs.map((tab, idx) => {
          const matchRoutes = Array.isArray(tab.matchRoutes)
            ? tab.matchRoutes
            : [tab.route]; // fallback nếu không có matchRoutes
          const isActive = matchRoutes.some((route) =>
            currentPath.startsWith(route)
          );

          return (
            <div
              key={idx}
              className={`tab ${isActive ? "active" : ""}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
