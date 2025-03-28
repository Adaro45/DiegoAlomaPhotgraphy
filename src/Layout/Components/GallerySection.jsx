"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./Button"
import "./styles/GallerySection.css"

const GallerySection = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayTimeoutRef = useRef(null)

  // Load wedding images
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/images.json")
        const data = await response.json()

        // Filter only wedding images and limit to 20 for better performance
        const weddingImages = data
          .filter((img) => img.type === "Wedding")
          .slice(0, 20)
          .map((img) => img.src)

        setImages(weddingImages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading gallery images:", error)
        setIsLoading(false)
      }
    }

    loadImages()
  }, [])

  // Handle autoplay
  useEffect(() => {
    if (!autoplay || images.length === 0) return

    const startAutoplay = () => {
      autoplayTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        startAutoplay()
      }, 5000)
    }

    startAutoplay()

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }
    }
  }, [autoplay, images.length, currentIndex])

  // Navigation functions
  const prevSlide = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const nextSlide = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Resume autoplay after user interaction
  const handleMouseLeave = () => {
    setAutoplay(true)
  }

  return (
    <section className="gallery-section" onMouseLeave={handleMouseLeave}>
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="line"></div>
        <h2 className="section-title">WEDDINGS</h2>
        <div className="line"></div>
      </motion.div>

      <div className="gallery-content">
        <motion.div
          className="gallery-slider"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="gallery-loading">
              <div className="loading-spinner"></div>
              <p>Loading beautiful moments...</p>
            </div>
          ) : (
            <>
              <button className="gallery-nav prev" onClick={prevSlide} aria-label="Previous image">
                <ChevronLeft size={24} />
              </button>

              <div className="gallery-slides">
                {images.map((src, index) => (
                  <motion.img
                    key={`wedding-${index}`}
                    src={src}
                    alt={`Wedding photography by Diego Aloma ${index + 1}`}
                    className={`gallery-slide ${index === currentIndex ? "active" : ""}`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0,
                      scale: index === currentIndex ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.5 }}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              <button className="gallery-nav next" onClick={nextSlide} aria-label="Next image">
                <ChevronRight size={24} />
              </button>

              <div className="gallery-indicators">
                {images.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    className={`indicator ${index === currentIndex ? "active" : ""}`}
                    onClick={() => {
                      setAutoplay(false)
                      setCurrentIndex(index)
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          className="gallery-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="gallery-title">Capturing your Love Story</h2>
          <p className="gallery-description">
            Your wedding is a story of <strong>love</strong>, <strong>laughter</strong>, and{" "}
            <strong>unforgettable moments</strong>. As your photographer, I turn these emotions into timeless images
            that reflect your unique journey.
          </p>
          <Button text="View Gallery" link="/portfolio" variant="primary" size="large" className="gallery-button" />
        </motion.div>
      </div>
    </section>
  )
}

export default GallerySection

