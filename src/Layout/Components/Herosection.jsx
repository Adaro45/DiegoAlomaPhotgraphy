"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePublicData } from "../../context/PublicDataContext"
import "./styles/ImageSlider.css"

const ImageSlider = () => {
  const { slideshows, loading: dataLoading } = usePublicData()
  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Shuffle array usando Fisher-Yates algorithm
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // Cargar imágenes del slideshow "home-page"
  useEffect(() => {
    if (dataLoading) return

    try {
      const homePageImages = slideshows["home-page"] || []
      
      if (homePageImages.length === 0) {
        console.warn("No hay imágenes en el slideshow home-page")
        setLoading(false)
        return
      }

      // Formatear las imágenes
      const formattedImages = homePageImages.map((src, index) => ({
        id: index + 1,
        src: src,
        type: "SlideShow",
      }))

      // Mezclar y limitar a 20 para mejor performance
      const shuffledImages = shuffleArray(formattedImages).slice(0, 20)
      setImages(shuffledImages)
      setLoading(false)
    } catch (error) {
      console.error("Error inicializando slideshow:", error)
      setLoading(false)
    }
  }, [slideshows, dataLoading, shuffleArray])

  // Auto-avanzar slides
  useEffect(() => {
    if (images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [images])

  // Determinar clases de posición de imagen
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

  if (loading || dataLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading beautiful moments...</p>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="loading-container">
        <p>No slideshow images available</p>
      </div>
    )
  }

  return (
    <div className="image-slider-container">
      <div className="image-slider">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={`slideshow-${index}`}
              className={`slider-image-container ${getClassName(index)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: getClassName(index) !== "slider-hidden" ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={`Photography by Diego Aloma - Slideshow ${index + 1}`}
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