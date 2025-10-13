"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePublicData } from "../../context/PublicDataContext"
import Button from "./Button"
import "./styles/GallerySection.css"

const GallerySection = () => {
  const { galleryPhotos, loading: dataLoading, loadSlideshowBySlug } = usePublicData()

  const [images, setImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const intervalRef = useRef(null)

  const SLUG = "weddings-home-page" // <-- cambia aquí si tu slug es distinto

  // Cargar slideshow por slug y fallback a galleryPhotos.Wedding
  useEffect(() => {
    if (dataLoading) return
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const result = await loadSlideshowBySlug(SLUG) // { images, error }
        if (!mounted) return

        // Si la carga del slideshow devolvió imágenes válidas, las usamos
        if (result && Array.isArray(result.images) && result.images.length > 0) {
          setImages(result.images.slice(0, 20))
          setCurrentIndex(0)
          setIsLoading(false)
          return
        }

        // Si no hay imágenes en el slideshow, fallback a galleryPhotos.Wedding
        console.warn(`⚠️ Slideshow '${SLUG}' vacío o no encontrado, usando galleryPhotos.Wedding como fallback`)
        const rawWedding = galleryPhotos?.Wedding || []

        // Normalizar: cada item puede ser string (url) o objeto { url, storage_path, ... }
        const weddingImages = rawWedding
          .map((item) => {
            if (!item) return null
            if (typeof item === "string") return item
            if (typeof item === "object") return item.url || item.storage_path || item.publicUrl || null
            return null
          })
          .filter(Boolean)

        if (weddingImages.length === 0) {
          console.warn("⚠️ No hay imágenes disponibles en galleryPhotos.Wedding")
          setImages([])
          setCurrentIndex(0)
          setIsLoading(false)
          return
        }

        setImages(weddingImages.slice(0, 20))
        setCurrentIndex(0)
        setIsLoading(false)
      } catch (err) {
        console.error("❌ Error cargando slideshow para GallerySection:", err)
        // fallback sencillo
        const rawWedding = galleryPhotos?.Wedding || []
        const weddingImages = rawWedding
          .map((item) => {
            if (!item) return null
            if (typeof item === "string") return item
            if (typeof item === "object") return item.url || item.storage_path || item.publicUrl || null
            return null
          })
          .filter(Boolean)

        if (!mounted) return
        setImages(weddingImages.slice(0, 20))
        setCurrentIndex(0)
        setIsLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [dataLoading, galleryPhotos, loadSlideshowBySlug])

  // Asegurar que currentIndex está dentro del rango
  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0)
      return
    }
    if (currentIndex >= images.length) {
      setCurrentIndex(0)
    }
  }, [images, currentIndex])

  // Autoplay con setInterval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!autoplay || images.length === 0) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (images.length > 0 ? (prev + 1) % images.length : 0))
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoplay, images.length])

  const prevSlide = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(images.length - 1, 0) : prevIndex - 1))
  }

  const nextSlide = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (images.length > 0 ? (prevIndex + 1) % images.length : 0))
  }

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
          {isLoading || dataLoading ? (
            <div className="gallery-loading">
              <div className="loading-spinner"></div>
              <p>Loading beautiful moments...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="gallery-loading">
              <p>No wedding photos available</p>
              <p className="error-hint">Add wedding photos to the gallery from the dashboard</p>
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
                    onError={(e) => {
                      console.error("❌ Image failed to load:", src)
                      e.currentTarget.style.display = "none"
                    }}
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
