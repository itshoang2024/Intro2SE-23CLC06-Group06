import { SearchBarPattern } from "../../assets/icons/index";
import { HoverScale } from "../UI/Animations.jsx";
import { motion } from "framer-motion";

const SearchBar = ({ searchQuery, onSearchChange }) => (
  <motion.div 
    className="searchbar-container"
    whileFocus={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <HoverScale scale={1.1}>
      <img src={SearchBarPattern} alt="searchbar-pattern" width="16px" />
    </HoverScale>
    <motion.input
      type="text"
      className="searchbar-input no-animation"
      placeholder="Search"
      value={searchQuery}
      onChange={onSearchChange}
      whileFocus={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    />
  </motion.div>
);

export default SearchBar;
