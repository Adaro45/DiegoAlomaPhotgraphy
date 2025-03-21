"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./styles/ImageSlider.css"

const ImageSlider = () => {
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // Fetch images from JSON file
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const response = await fetch("/images.json")
        if (!response.ok) {
          throw new Error("Failed to load images")
        }
        const imageData = await response.json()

        // Limit to 20 images for better performance
        const limitedImages = shuffleArray(imageData).slice(0, 20)
        setImages(limitedImages)
        setLoading(false)
      } catch (err) {
        console.error("Error loading images:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchImages()
  }, [shuffleArray])

  // Auto-advance slides
  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [images])

  // Determine image position classes
  const getClassName = (index) => {
    const totalImages = images.length
    if (totalImages === 0) return "slider-hidden"

    const leftIndex = (currentIndex - 1 + totalImages) % totalImages
    const rightIndex = (currentIndex + 1) % totalImages
    const farLeftIndex = (currentIndex - 2 + totalImages) % totalImages
    const farRightIndex = (currentIndex + 2) % totalImages

    if (index === currentIndex) return "slider-center"
    if (index === leftIndex) return "slider-left"
    if (index === rightIndex) return "slider-right"
    if (index === farLeftIndex) return "slider-far-left"
    if (index === farRightIndex) return "slider-far-right"
    return "slider-hidden"
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading beautiful moments...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  return (
    <div className="image-slider-container">
      <div className="image-slider">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              className={`slider-image-container ${getClassName(index)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: getClassName(index) !== "slider-hidden" ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={`Photography by Diego Aloma - ${image.type}`}
                className="slider-image"
                loading={index < 5 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ImageSlider

