import React, { useState, useEffect } from "react";
import "./styles/AboutMe.css";
import Button from "../Components/Button";
import { portfolioImages } from "../../globalimages";

const CategorySection = ({ type, title, description, align,textbutton}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const filteredImages = portfolioImages.filter(img => img.type === type);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % filteredImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredImages.length]);

  return (
    <section className="category-section">
      <h3 className="category-title">{title}</h3>
      <div className={`content ${align === 'right' ? 'reverse' : ''}`}>
        <div className="text-content">
          <p className="category-description">{description}</p>
          <Button text={textbutton} link={"/contact"}/>
        </div>
        <div className="carousel-container">
          {filteredImages.map((image, index) => (
            <img 
              key={`${image.type}-${image.id}`}
              src={image.src}
              alt={`${type} photography`}
              className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutMe = () => {
  return (
    <section className="About-Me">
      <section className="intro-section">
        <div className="image-me-container">
          <img 
            src="/images/Diego.jpeg" 
            alt="Diego Aloma" 
            className="image-me"
            loading="lazy"
          />
        </div>

        <div className="text-container">
          <h2 className="name-title">Diego Aloma</h2>
          <p className="paragraph">
            As a dedicated wedding photographer with over 6 years of experience, I specialize in 
            transforming fleeting moments into everlasting memories. My journey in photography began 
            as a passion for storytelling through visuals, evolving into a career that allows me to 
            witness and document life's most precious celebrations. Based in Barcelona but available 
            worldwide, I blend documentary-style authenticity with fine art aesthetics to create 
            images that feel both timeless and emotionally resonant.
          </p>
          <p className="paragraph">
            What sets my work apart is the emphasis on genuine interactions. I believe the best 
            photographs come from real moments, not forced poses. When I'm not behind the camera, 
            you'll find me exploring new lighting techniques or mentoring aspiring photographers 
            in my popular workshop series.
          </p>
          <div className="button-container">
            <Button text="Contact Me" link={"/contact"}/>
          </div>
        </div>
      </section>

      <h2 className="section-title">Explore My Work</h2>

      <CategorySection
        type="Wedding"
        title="Wedding Photography"
        description="Capturing the magic of your special day is my greatest privilege. From morning 
        preparations to the final dance, I document every genuine smile, tender tear, and loving 
        glance. My unobtrusive style lets you fully immerse in each moment while I create timeless 
        memories you'll relive for years to come."
        align="left"
        textbutton={"Keep you Love Story"}
        
      />
      <CategorySection
        type="Portrait"
        title="Portrait Photography"
        description="Great portraits reveal more than features - they unveil personality. Whether 
        for professional headshots or creative personal sessions, I work to bring out your most 
        authentic self. Using natural light and innovative compositions, I create images that 
        don't just show who you are, but tell your unique story."
        align="right"
        textbutton={"Create  Timeless Portraits"}

        
      />
      <CategorySection
        type="NewbornAndFamily"
        title="Newborn & Family Photography"
        description="Those first precious days deserve to be remembered forever. With patience and 
        care, I create heartwarming images you'll treasure as your family grows. My sessions capture 
        the authentic bonds that make your family unique, whether in studio sessions or outdoor 
        adventures filled with natural connection."
        align="left"
        textbutton={"Preserve Childhood Magic"}

       />
    </section>
  );
};

export default AboutMe;