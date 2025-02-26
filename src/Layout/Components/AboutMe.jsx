import React from "react";
import "./styles/AboutMe.css";
import Button from "./Button";

const AboutMe = () => {
  return (
    <section className="About-Me">
      <div className="title-container">
        <div className="line"></div>
        <h1 className="title">ABOUT ME</h1>
      </div>
      <section className="about-content">
        <div className="image-me-container">
          <img
            src="/images/Diego.jpeg"
            alt="Diego Aloma"
            className="image-me"
          />
        </div>
        <div className="paragraph-container">
          <h2 className="name-title">Diego Aloma</h2>
          <p className="paragraph">
            "I am Diego Aloma, a wedding photographer passionate about capturing
            telling love stories through images. My style combines documentary
            photography with an artistic touch, aiming to capture the essence
            and emotion of every moment from the nervous and exciting
            preparations to the overflowing joy of the celebration. I focus on
            creating authentic and heartfelt memories that allow you to relive
            your big day over and over again."
          </p>
          {/* Este bloque se oculta en móviles */}
          <div className="hide-mobile">
            <h2 className="name-title">My Passion</h2>
            <p className="paragraph">
              My passion lies in capturing the beauty of fleeting moments and
              transforming them into timeless memories. I am deeply inspired by
              the power of photography to tell stories, evoke emotions, and
              connect people to the most meaningful days of their lives.
            </p>
          </div>
          <div className="Social-media">
            <div className="Social-media_item">
            <img
              src="/images/icons/logotipo-de-instagram.png"
              alt="Instagram"
              className="icon"
            />
            <a
              href="https://www.instagram.com/diegoaloma_photos/"
              className="social-media"
            >
              diegoaloma_photos
            </a>
            </div>
            <div className="Social-media_item">
            <img
              src="/images/icons/facebook.png"
              alt="Facebook"
              className="icon"
            />
            <a
              href="https://www.facebook.com/DiegoAlomaPhotography"
              className="social-media"
            >
              Diego Alomá Photography
            </a>
            </div>
            <div className="Social-media_item">
            
            <img
              src="/images/icons/threads.png"
              alt="Threads"
              className="icon"
            />
            <a
              href="https://www.threads.net/@diegoaloma_photos"
              className="social-media"
            >
              diegoaloma_photos
            </a>
            </div>

            <Button text="Contact Me" link={"aboutme"}/>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AboutMe;
