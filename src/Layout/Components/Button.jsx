"use client"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import "./styles/Button.css"

const Button = ({ text, link, variant = "primary", size = "medium", onClick, className = "", external = false }) => {
  const buttonClasses = `button button-${variant} button-${size} ${className}`

  if (external && link) {
    return (
      <a href={link} className={buttonClasses} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {text}
      </a>
    )
  }

  if (link) {
    return (
      <Link to={link} className={buttonClasses} onClick={onClick}>
        {text}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "text"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  external: PropTypes.bool,
}

export default Button

