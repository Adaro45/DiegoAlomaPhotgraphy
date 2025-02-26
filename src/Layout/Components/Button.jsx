// Button.js
import React from "react";
import { Link } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado
import "./styles/Button.css";

const Button = ({ text, link }) => {
  return (
    <Link to={link} className="button button-gallery">
      {text}
    </Link>
  );
};

export default Button;
