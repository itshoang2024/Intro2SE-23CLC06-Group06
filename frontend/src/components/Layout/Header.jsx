import { Link } from "react-router-dom";
import { Bell, Plus } from "../../assets/Auth/index.jsx";
import MainPageLogo from "../../assets/Logo.svg";
import SearchBar from "../Forms/SearchBar.jsx";
import DropdownMenu from "../Navigation/DropdownMenu.jsx";
import { useEmailVerificationRedirect } from "../../hooks/useEmailVerificationRedirect.js";
import { useAuth } from "../../services/Auth/authContext.jsx";
import { 
  SlideInDown, 
  HoverScale, 
  FadeIn,
  NavItemAnimation 
} from "../UI/Animations.jsx";

const Header = ({ searchQuery, onSearchChange }) => {
  const { user, loading } = useAuth();

  // Handle email verification redirect for authenticated users
  useEmailVerificationRedirect();

  if (loading) return null;
  
  return (
    <SlideInDown>
      <nav className="header">
        {/* Logo */}
        {user ? (
          <Link to="/homepage" className="header__site-title">
            <HoverScale scale={1.1}>
              <img
                src={MainPageLogo}
                alt="Vocaboost Logo"
                className="header-logo"
              />
            </HoverScale>
          </Link>
        ) : (
          <Link to="/" className="header__site-title">
            <HoverScale scale={1.1}>
              <img
                src={MainPageLogo}
                alt="Vocaboost Logo"
                className="header-logo"
              />
            </HoverScale>
          </Link>
        )}

        {/* Search Bar */}
        <FadeIn delay={0.2}>
          <div className="header__search-bar">
            <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
          </div>
        </FadeIn>

        {user ? (
          <FadeIn delay={0.3}>
            <div className="header__user">
              {/* Create list action */}
              <NavItemAnimation>
                <Link to="/vocabulary" className="homepage_create-list">
                  <img src={Plus} alt="create-list-icon" style={{ width: "30px" }} />
                </Link>
              </NavItemAnimation>

              {/* Notification bell */}
              <NavItemAnimation>
                <div className="homepage__notification">
                  <img src={Bell} alt="notification-icon" style={{ width: "30px" }} />
                </div>
              </NavItemAnimation>

              {/* Avatar Dropdown */}
              <div className="homepage__topbar">
                <DropdownMenu />
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.3}>
            <div className="header__non-user">
              <div className="login-signup">
                <NavItemAnimation>
                  <Link to="/signin" className="signin">
                    Sign in
                  </Link>
                </NavItemAnimation>
                <NavItemAnimation>
                  <Link to="/signup" className="signup">
                    Sign up
                  </Link>
                </NavItemAnimation>
              </div>
            </div>
          </FadeIn>
        )}
      </nav>
    </SlideInDown>
  );
};

export default Header;
