import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../index.css";
import { GiHamburgerMenu } from "react-icons/gi";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="App-header">
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
      <GiHamburgerMenu />
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      <ul className={`menu-list ${menuOpen ? "mobile-open" : ""}`}>
        <li className="menu-item">
          <Link to="/" onClick={() => setMenuOpen(false)}>HOME</Link>
        </li>
        <li className="menu-item">
          <Link to="/about-me" onClick={() => setMenuOpen(false)}>ABOUT ME</Link>
        </li>
        <li className="menu-item">
          <Link to="/portfolio" onClick={() => setMenuOpen(false)}>PORTFOLIO</Link>
        </li>
        <li className="menu-item">
          <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
