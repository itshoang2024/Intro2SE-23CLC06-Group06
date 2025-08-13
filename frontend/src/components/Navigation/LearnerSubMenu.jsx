import { NavLink } from "react-router-dom";
import { useToast } from "../Providers/ToastProvider.jsx";

export default function LearnerSubMenu() {
  const toast = useToast();

  return (
    <div className="learner-submenu">
      <NavLink
        to="/my-classroom"
        className={({ isActive }) => `submenu-tab ${isActive ? "active" : ""}`}
      >
        My Classrooms
      </NavLink>

      <NavLink
        to="/vocabulary"
        className={({ isActive }) => `submenu-tab ${isActive ? "active" : ""}`}
      >
        My Vocabulary Lists
      </NavLink>

      <NavLink
        to="/statistics"
        className={({ isActive }) => `submenu-tab ${isActive ? "active" : ""}`}
      >
        Statistics
      </NavLink>
    </div>
  );
}
