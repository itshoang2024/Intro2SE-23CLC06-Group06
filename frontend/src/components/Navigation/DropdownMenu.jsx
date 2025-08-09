import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropDownMenuPattern1,
  DropDownMenuPattern2,
  DropDownMenuPattern3,
} from "../../assets/icons/index";
import authService from "../../services/Auth/authService";
import { useAuth } from "../../services/Auth/authContext";
import { 
  FadeIn, 
  SlideInDown, 
  HoverScale, 
  StaggerContainer, 
  StaggerItem
} from "../UI/Animations.jsx";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // bien dung de theo doi phan tu dropdown
  const navigate = useNavigate();

  const { user, logout: contextLogout } = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Hieu ung dropdown Menu
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    // Thêm event listener khi component mount
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      // Cleanup event listener khi component unmount
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [isOpen]);

  // BE: Xu ly logout
  const handleLogOut = async () => {
    try {
      await authService.logout();
      contextLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dropdown__container" ref={dropdownRef}>
      <HoverScale scale={1.1}>
        <button onClick={toggleDropdown} className="dropdown__trigger">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="avatar-img" /> // Dung hinh anh
          ) : (
            <span className="avatar-placeholder">
              {user?.email?.charAt(0).toUpperCase() || "?"}
            </span> // dung chu cai dau cua email
          )}
        </button>
      </HoverScale>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown__content"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <StaggerContainer>
              <StaggerItem>
                <HoverScale scale={1.02}>
                  <Link to="/profile" className="dropdown__item">
                    My Profile
                    <img
                      src={DropDownMenuPattern1}
                      alt="drop-down-menu-pattern1"
                      className="drop-down-menu-pattern1"
                    />
                  </Link>
                </HoverScale>
              </StaggerItem>
              
              <StaggerItem>
                <img
                  src={DropDownMenuPattern3}
                  alt="drop-down-menu-pattern3"
                  className="drop-down-menu-pattern3"
                />
              </StaggerItem>
              
              <StaggerItem>
                <HoverScale scale={1.02}>
                  <button onClick={handleLogOut} className="dropdown__item no-animation">
                    Log out
                    <img
                      src={DropDownMenuPattern2}
                      alt="drop-down-menu-pattern2"
                      className="drop-down-menu-pattern1"
                    />
                  </button>
                </HoverScale>
              </StaggerItem>
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
