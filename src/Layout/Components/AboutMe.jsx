"use client"
import "./styles/AboutMe.css"
import Button from "./Button"
import { motion } from "framer-motion"

const AboutMe = () => {
  return (
    <motion.section
      className="about-me-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="section-header">
        <div className="line"></div>
        <h1 className="section-title">ABOUT ME</h1>
        <div className="line"></div>
      </div>

      <div className="about-content">
        <motion.div
          className="image-container"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/images/Diego.jpeg" alt="Diego Aloma" className="profile-image" loading="lazy" />
        </motion.div>

        <motion.div
          className="text-container"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="name-title">Diego Aloma</h2>
          <p className="about-paragraph">
            "I am Diego Aloma, a wedding photographer passionate about capturing telling love stories through images. My
            style combines documentary photography with an artistic touch, aiming to capture the essence and emotion of
            every moment from the nervous and exciting preparations to the overflowing joy of the celebration. I focus
            on creating authentic and heartfelt memories that allow you to relive your big day over and over again."
          </p>

          <div className="hide-mobile">
            <h2 className="name-title">My Passion</h2>
            <p className="about-paragraph">
              My passion lies in capturing the beauty of fleeting moments and transforming them into timeless memories.
              I am deeply inspired by the power of photography to tell stories, evoke emotions, and connect people to
              the most meaningful days of their lives.
            </p>
          </div>

          <div className="social-media-links">
            <a
              href="https://www.instagram.com/diegoaloma_photos/"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/icons/logotipo-de-instagram.png" alt="Instagram" className="social-icon" />
              <span>diegoaloma_photos</span>
            </a>

            <a
              href="https://www.facebook.com/DiegoAlomaPhotography"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/icons/facebook.png" alt="Facebook" className="social-icon" />
              <span>Diego Alomá Photography</span>
            </a>

            <a
              href="https://www.threads.net/@diegoaloma_photos"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/icons/threads.png" alt="Threads" className="social-icon" />
              <span>diegoaloma_photos</span>
            </a>
          </div>

          <div className="button-container">
            <Button text="Contact Me" link="/contact" variant="primary" size="large" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default AboutMe

