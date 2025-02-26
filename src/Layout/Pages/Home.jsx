import React from "react";
import AboutMe from "../Components/AboutMe";
import ImageSlider from "../Components/Herosection";
import GallerySection from "../Components/GallerySection";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div>
      <section className="App-herosection">
        <img
          src="/images/BlackLogo.png"
          alt="Black Logo"
          className="black-logo"
        />
        <ImageSlider imageDirectory="/images/photos/SlideShow" />
      </section>
      <AboutMe />
      <GallerySection />
      <Footer />
    </div>
  );
};

export default Home;
