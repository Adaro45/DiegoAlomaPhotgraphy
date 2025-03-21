"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronRight, ChevronLeft, X } from "lucide-react"
import "./styles/Portfolio.css"
import { portfolioImages } from "../../globalimages"
import Footer from "../Components/Footer"

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isAsideVisible, setIsAsideVisible] = useState(!isMobile)
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const asideRef = useRef(null)
  const buttonRef = useRef(null)

  const categories = ["All", "Wedding", "Portrait", "NewbornAndFamily"]

  // Format category names for display
  const formatCategoryName = (category) => {
    if (category === "NewbornAndFamily") return "Newborn & Family"
    return category
  }

  // Filter images based on selected category
  const filteredImages =
    selectedCategory === "All" ? portfolioImages : portfolioImages.filter((image) => image.type === selectedCategory)

  // Sort images by category for "All" view
  const sortedImages =
    selectedCategory === "All"
      ? [...filteredImages].sort((a, b) => {
          const order = { Wedding: 1, Portrait: 2, NewbornAndFamily: 3 }
          const aOrder = order[a.type] || 4
          const bOrder = order[b.type] || 4
          return aOrder - bOrder
        })
      : filteredImages

  // Distribute images into columns for masonry layout
  const getColumns = (items, numCols) => {
    const columns = Array.from({ length: numCols }, () => [])

    // Distribute images to balance column heights
    const itemsWithHeight = items.map((item) => ({
      ...item,
      // Estimate height based on a typical aspect ratio
      estimatedHeight: 300, // Default height estimate
    }))

    const columnHeights = Array(numCols).fill(0)

    itemsWithHeight.forEach((item) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
      columns[shortestColumnIndex].push(item)
      columnHeights[shortestColumnIndex] += item.estimatedHeight
    })

    return columns
  }

  const numColumns = isMobile ? 2 : 3
  const columns = numColumns === 1 ? [sortedImages] : getColumns(sortedImages, numColumns)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)

      // Only auto-show sidebar on desktop
      if (!newIsMobile !== !isMobile) {
        setIsAsideVisible(!newIsMobile)
      }
    }

    window.addEventListener("resize", handleResize)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [isMobile])

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    setIsLoading(true)

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Simulate loading delay when changing categories
    setTimeout(() => {
      setIsLoading(false)
    }, 500)

    // Close mobile sidebar after selection
    if (isMobile) {
      setIsAsideVisible(false)
    }
  }

  // Toggle sidebar visibility
  const toggleSidebar = (e) => {
    if (e) e.stopPropagation()
    setIsAsideVisible((prev) => !prev)
  }

  // Open lightbox
  const openLightbox = (image) => {
    setLightboxImage(image)
    document.body.style.overflow = "hidden"
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxImage(null)
    document.body.style.overflow = "auto"
  }

  return (
    <>
      <div className="portfolio-page">
        <motion.h1
          className="portfolio-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio
        </motion.h1>

        <div className={`portfolio-layout ${isAsideVisible ? "sidebar-visible" : ""}`}>
          {/* Toggle sidebar button */}
          <button
            ref={buttonRef}
            className="toggle-sidebar-button"
            onClick={toggleSidebar}
            aria-label={isAsideVisible ? "Hide categories" : "Show categories"}
            aria-expanded={isAsideVisible}
          >
            {isAsideVisible ? <ChevronLeft /> : <ChevronRight />}
          </button>

          {/* Sidebar with category filters */}
          <AnimatePresence>
            {isAsideVisible && (
              <motion.aside
                ref={asideRef}
                className="portfolio-sidebar"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="sidebar-title">Categories</h2>
                <ul className="category-list">
                  {categories.map((category) => (
                    <li
                      key={category}
                      className={`category-item ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {formatCategoryName(category)}
                    </li>
                  ))}
                </ul>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main gallery content */}
          <main className="portfolio-gallery">
            {/* Mobile category selector */}
            {isMobile && (
              <div className="mobile-category-selector">
                <div className="mobile-filter-icon" onClick={toggleSidebar}>
                  <Filter size={18} />
                  <span>Filter:</span>
                </div>
                <div className="mobile-categories">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`mobile-category ${selectedCategory === category ? "active" : ""}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {formatCategoryName(category)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="gallery-loading">
                <div className="loading-spinner"></div>
                <p>Loading gallery...</p>
              </div>
            ) : (
              <motion.div
                className="gallery-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {columns.map((column, colIndex) => (
                  <div key={`column-${colIndex}`} className="gallery-column">
                    {column.map((image, imgIndex) => (
                      <motion.div
                        key={`${image.type}-${image.id}`}
                        className="gallery-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: colIndex * 0.1 + imgIndex * 0.05,
                        }}
                        whileHover={{ y: -5 }}
                        onClick={() => openLightbox(image)}
                      >
                        <div className="image-container">
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt={`${image.type} photography by Diego Aloma`}
                            loading="lazy"
                          />
                          <div className="image-overlay">
                            <span className="image-category">{formatCategoryName(image.type)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            )}
          </main>
        </div>

        {/* Lightbox */}
        {lightboxImage && (
          <div className="lightbox" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <X size={24} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImage.src || "/placeholder.svg"}
                alt={`${lightboxImage.type} photography by Diego Aloma`}
                className="lightbox-image"
              />
              <div className="lightbox-info">
                <span className="lightbox-category">{formatCategoryName(lightboxImage.type)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Portfolio

