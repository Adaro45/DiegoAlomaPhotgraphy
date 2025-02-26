import React, { useState, useEffect } from "react";
import "./styles/ImageSlider.css";

// Función para mezclar el array usando el algoritmo Fisher-Yates
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Se carga el archivo JSON desde la carpeta public
        const response = await fetch("/images.json");
        if (!response.ok) {
          throw new Error("Error al cargar el JSON");
        }
        const imageData = await response.json();
        // Aquí ya se tienen todas las imágenes (Wedding y Portrait)
        setImages(shuffleArray(imageData)); // Mezcla las imágenes al cargar
      } catch (error) {
        console.error("Error cargando imágenes:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const getClassName = (index) => {
    const totalImages = images.length;
    const leftIndex = (currentIndex - 1 + totalImages) % totalImages;
    const rightIndex = (currentIndex + 1) % totalImages;
    const farLeftIndex = (currentIndex - 2 + totalImages) % totalImages;
    const farRightIndex = (currentIndex + 2) % totalImages;

    if (index === currentIndex) return "slider-center";
    if (index === leftIndex) return "slider-left";
    if (index === rightIndex) return "slider-right";
    if (index === farLeftIndex) return "slider-far-left";
    if (index === farRightIndex) return "slider-far-right";
    return "slider-hidden";
  };

  if (images.length === 0) {
    return <div className="loading-message">Cargando imágenes...</div>;
  }

  return (
    <div className="image-slider-container">
      <div className="image-slider">
        {images.map((image, index) => (
          <img
            key={`${image.src}-${index}`}
            src={image.src}
            alt={`Imagen ${index + 1}`}
            className={`slider-image ${getClassName(index)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
