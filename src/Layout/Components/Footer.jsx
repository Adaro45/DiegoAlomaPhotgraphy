import React from "react";
import "./styles/Footer.css"; // Asegúrate de incluir los estilos aquí

const Footer = () => {
  return (
    <footer className="footer">
      <img src="/images/WhiteLogo.png" alt="Logo" className="logo-footer" />
      <div className="social-media-footer">
        <a
          href="https://www.instagram.com/diegoaloma/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/icons/logotipo-de-instagram.png"
            alt="Instagram"
            className="icon"
          />
        </a>
        <a
          href="https://www.facebook.com/DiegoAloma"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/icons/facebook.png"
            alt="Facebook"
            className="icon"
          />
        </a>
        <p>&copy; 2024 Diego Aloma</p>
      </div>
      <p className="contact-mail">
        <img src="/images/icons/email.png" alt="email" className="icon-email" />
        <a href="mailto:diegoaloma@photographer.com">diegoaloma@photographer.com</a>
      </p>
    </footer>
  );
};

export default Footer;
