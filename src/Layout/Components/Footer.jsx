import { Link } from "react-router-dom"
import { FaInstagram, FaFacebookF, FaEnvelope, FaHeart } from "react-icons/fa"
import "./styles/Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/images/WhiteLogo.png" alt="Diego Aloma Photography" className="footer-logo" />
          <p className="footer-tagline">Capturing moments, creating memories</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about-me">About Me</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <a href="mailto:alomadiego302@gmail.com" className="footer-contact-item">
            <FaEnvelope />
            <span>alomadiego302@gmail.com</span>
          </a>
          <p className="footer-contact-item">
            <span>New Jersey, USA</span>
          </p>
          <p className="footer-contact-item">
            <span>+1 (862) 361-8242</span>
          </p>
        </div>

        <div className="footer-social">
          <h3>Follow Me</h3>
          <div className="social-icons">
            <a
              href="https://www.instagram.com/diegoaloma_photos/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/DiegoAlomaPhotography"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Diego Aloma Photography. All rights reserved.</p>
        <p className="footer-credit">
          Made with <FaHeart className="heart-icon" /> for capturing life's precious moments
        </p>
      </div>
    </footer>
  )
}

export default Footer

