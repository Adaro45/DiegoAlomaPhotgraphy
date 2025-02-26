import React, { useState, useEffect } from "react";
import "./styles/GallerySection.css";
import Button from "./Button";
import { AiOutlineCaretRight, AiOutlineCaretLeft } from "react-icons/ai";

const images = [
   "/images/photos/Wedding/1.webp",
   "/images/photos/Wedding/2.webp",
   "/images/photos/Wedding/3.webp",
   "/images/photos/Wedding/4.webp",
   "/images/photos/Wedding/5.webp",
   "/images/photos/Wedding/6.webp",
   "/images/photos/Wedding/7.webp",
   "/images/photos/Wedding/8.webp",
   "/images/photos/Wedding/9.webp",
   "/images/photos/Wedding/10.webp", 
   "/images/photos/Wedding/11.webp", 
   "/images/photos/Wedding/12.webp", 
   "/images/photos/Wedding/13.webp", 
   "/images/photos/Wedding/14.webp", 
   "/images/photos/Wedding/15.webp", 
   "/images/photos/Wedding/16.webp", 
   "/images/photos/Wedding/17.webp", 
   "/images/photos/Wedding/18.webp", 
   "/images/photos/Wedding/19.webp", 
   "/images/photos/Wedding/20.webp", 
   "/images/photos/Wedding/21.webp", 
   "/images/photos/Wedding/22.webp", 
   "/images/photos/Wedding/23.webp", 
   "/images/photos/Wedding/24.webp", 
   "/images/photos/Wedding/25.webp", 
   "/images/photos/Wedding/26.webp", 
   "/images/photos/Wedding/27.webp", 
   "/images/photos/Wedding/28.webp", 
   "/images/photos/Wedding/29.webp", 
   "/images/photos/Wedding/30.webp", 
   "/images/photos/Wedding/31.webp", 
   "/images/photos/Wedding/32.webp", 
   "/images/photos/Wedding/33.webp", 
   "/images/photos/Wedding/34.webp", 
   "/images/photos/Wedding/35.webp", 
   "/images/photos/Wedding/36.webp", 
   "/images/photos/Wedding/37.webp", 
   "/images/photos/Wedding/38.webp", 
   "/images/photos/Wedding/39.webp", 
   "/images/photos/Wedding/40.webp", 
   "/images/photos/Wedding/41.webp", 
   "/images/photos/Wedding/42.webp", 
   "/images/photos/Wedding/43.webp", 
   "/images/photos/Wedding/44.webp", 
   "/images/photos/Wedding/45.webp", 
   "/images/photos/Wedding/46.webp", 
   "/images/photos/Wedding/47.webp", 
   "/images/photos/Wedding/48.webp", 
   "/images/photos/Wedding/49.webp", 
   "/images/photos/Wedding/50.webp", 
   "/images/photos/Wedding/51.webp", 
   "/images/photos/Wedding/52.webp", 
   "/images/photos/Wedding/53.webp", 
   "/images/photos/Wedding/54.webp", 
   "/images/photos/Wedding/55.webp", 
   "/images/photos/Wedding/56.webp", 
   "/images/photos/Wedding/57.webp", 
   "/images/photos/Wedding/58.webp", 
   "/images/photos/Wedding/59.webp", 
   "/images/photos/Wedding/60.webp", 
   "/images/photos/Wedding/61.webp", 
   "/images/photos/Wedding/62.webp", 
   "/images/photos/Wedding/63.webp", 
   "/images/photos/Wedding/64.webp", 
   "/images/photos/Wedding/65.webp", 
   "/images/photos/Wedding/66.webp", 
   "/images/photos/Wedding/67.webp", 
   "/images/photos/Wedding/68.webp", 
   "/images/photos/Wedding/69.webp", 
   "/images/photos/Wedding/70.webp", 
   "/images/photos/Wedding/71.webp", 
   "/images/photos/Wedding/72.webp", 
   "/images/photos/Wedding/73.webp", 
   "/images/photos/Wedding/74.webp", 
   "/images/photos/Wedding/75.webp", 
   "/images/photos/Wedding/76.webp", 
   "/images/photos/Wedding/77.webp", 
   "/images/photos/Wedding/78.webp", 
   "/images/photos/Wedding/79.webp", 
   "/images/photos/Wedding/80.webp", 
   "/images/photos/Wedding/81.webp", 
   "/images/photos/Wedding/82.webp", 
   "/images/photos/Wedding/83.webp", 
   "/images/photos/Wedding/84.webp", 
   "/images/photos/Wedding/85.webp", 
   "/images/photos/Wedding/86.webp", 
   "/images/photos/Wedding/87.webp", 
   "/images/photos/Wedding/88.webp", 
   "/images/photos/Wedding/89.webp", 
   "/images/photos/Wedding/90.webp", 
   "/images/photos/Wedding/91.webp", 
   "/images/photos/Wedding/92.webp", 
   "/images/photos/Wedding/93.webp", 
   "/images/photos/Wedding/94.webp", 
   "/images/photos/Wedding/95.webp", 
   "/images/photos/Wedding/96.webp", 
   "/images/photos/Wedding/97.webp", 
   "/images/photos/Wedding/98.webp", 
   "/images/photos/Wedding/99.webp", 
   "/images/photos/Wedding/100.webp",
   "/images/photos/Wedding/101.webp",
   "/images/photos/Wedding/102.webp",
   "/images/photos/Wedding/103.webp",
   "/images/photos/Wedding/104.webp",
   "/images/photos/Wedding/105.webp",
   "/images/photos/Wedding/106.webp",
   "/images/photos/Wedding/107.webp",
   "/images/photos/Wedding/108.webp",
   "/images/photos/Wedding/109.webp",
   "/images/photos/Wedding/110.webp",
   "/images/photos/Wedding/111.webp",
   "/images/photos/Wedding/112.webp",
   "/images/photos/Wedding/113.webp",
   "/images/photos/Wedding/114.webp",
   "/images/photos/Wedding/115.webp",
   "/images/photos/Wedding/116.webp",
   "/images/photos/Wedding/117.webp",
   "/images/photos/Wedding/118.webp",
   "/images/photos/Wedding/119.webp",
   "/images/photos/Wedding/120.webp",
   "/images/photos/Wedding/121.webp",
   "/images/photos/Wedding/122.webp",
   "/images/photos/Wedding/123.webp",
   "/images/photos/Wedding/124.webp",
   "/images/photos/Wedding/125.webp",
   "/images/photos/Wedding/126.webp",
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático de imagen (para ambas vistas)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section className="gallery-section">
      <div className="title-container-bodas">
        <h1 className="title-bodas">WEDDINGS</h1>
        <div className="line-bodas"></div>
      </div>

      {/* Slideshow para ambas vistas */}
      <div className="gallery-slider">
        <button className="gallery-button prev" onClick={prevSlide}>
          <AiOutlineCaretLeft />
        </button>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="gallery-slide"
        />
        <button className="gallery-button next" onClick={nextSlide}>
          <AiOutlineCaretRight />
        </button>
      </div>

      {/* Texto siempre visible */}
      <div className="gallery-text">
        <h2>Capturing your Love Story</h2>
        <p className="gallery-paragraph">
          Your wedding is a story of <b>love</b>, <b>laughter</b>, and{" "}
          <b>unforgettable moments</b>. As your photographer, I turn these
          emotions into timeless images that reflect your unique journey.
        </p>
        <Button className="button-gallery" text="View Gallery" link={"portfolio"}/>
      </div>
    </section>
  );
};

export default GallerySection;
