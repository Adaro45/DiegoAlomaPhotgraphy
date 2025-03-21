"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoMdClose } from "react-icons/io"
import "./styles/Header.css"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <header className={`app-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <Link to="/" className="logo-link">
          <img src="/images/BlackLogo.png" alt="Diego Aloma Photography" className="header-logo" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>

        <nav className={`navigation ${menuOpen ? "open" : ""}`}>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                HOME
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/about-me" className={location.pathname === "/about-me" ? "active" : ""}>
                ABOUT ME
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/portfolio" className={location.pathname === "/portfolio" ? "active" : ""}>
                PORTFOLIO
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </header>
  )
}

export default Header

