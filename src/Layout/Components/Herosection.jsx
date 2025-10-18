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
      const shuffledImages = shuffleArray(formattedImages)
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
    }, 10000)

    return () => clearInterval(interval)
  }, [images])

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
        <AnimatePresence mode="wait">
          <motion.div
            key={`slideshow-${currentIndex}`}
            className="slider-image-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={images[currentIndex].src || "/placeholder.svg"}
              alt={`Photography by Diego Aloma - Slideshow ${currentIndex + 1}`}
              className="slider-image"
              loading={currentIndex < 5 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ImageSlider