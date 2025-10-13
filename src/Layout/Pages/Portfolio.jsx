"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ChevronRight, ChevronLeft, X } from "lucide-react"
import "./styles/Portfolio.css"
// import { portfolioImages } from "../../globalimages" <-- ya no se usa
import Footer from "../Components/Footer"
import { usePublicData } from "../../context/PublicDataContext"

const Portfolio = () => {
  const { galleryPhotos, loading: dataLoading, getPublicUrl } = usePublicData()

  // Responsive
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : true)
  const [isAsideVisible, setIsAsideVisible] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : true)

  // Estado de imágenes dinámicas
  const [portfolioImages, setPortfolioImages] = useState([]) // { id, type, src, filename? }
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const asideRef = useRef(null)
  const buttonRef = useRef(null)

  const categories = ["All", "Wedding", "Portrait", "NewbornAndFamily"]

  // Formateo para mostrar
  const formatCategoryName = (category) => {
    if (category === "NewbornAndFamily") return "Newborn & Family"
    return category
  }

  // ----- Resolvemos galleryPhotos del context a portfolioImages (URLs completas) -----
  useEffect(() => {
    let mounted = true
    const resolveAll = async () => {
      setIsLoading(true)

      try {
        // galleryPhotos esperado como { Wedding: [...], Portrait: [...], NewbornAndFamily: [...] }
        const types = ["Wedding", "Portrait", "NewbornAndFamily"]
        const results = []

        for (const type of types) {
          const raw = galleryPhotos?.[type] || []
          // raw puede ser array de strings o objetos
          const resolvedForType = await Promise.all(
            raw.map(async (item, idx) => {
              if (!item) return null

              // Si es string y ya es URL absoluta => usarla
              if (typeof item === "string" && /^(https?:)?\/\//i.test(item)) {
                return {
                  id: `${type}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
                  type,
                  src: item,
                }
              }

              // Si es string pero no tiene http -> asumimos storage_path
              if (typeof item === "string") {
                if (getPublicUrl && typeof getPublicUrl === "function") {
                  try {
                    const url = await getPublicUrl(item)
                    if (url) {
                      return {
                        id: `${type}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
                        type,
                        src: url,
                      }
                    }
                    console.warn("getPublicUrl returned empty for:", item)
                    return null
                  } catch (err) {
                    console.warn("Error getting public url for storage_path:", item, err)
                    return null
                  }
                } else {
                  console.warn("getPublicUrl no está disponible en el context; item ignorado:", item)
                  return null
                }
              }

              // Si es objeto, preferimos item.url -> item.publicUrl -> item.storage_path
              if (typeof item === "object") {
                if (item.url && /^(https?:)?\/\//i.test(item.url)) {
                  return {
                    id: item.id || `${type}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
                    type,
                    src: item.url,
                    filename: item.filename,
                  }
                }
                if (item.publicUrl && /^(https?:)?\/\//i.test(item.publicUrl)) {
                  return {
                    id: item.id || `${type}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
                    type,
                    src: item.publicUrl,
                    filename: item.filename,
                  }
                }
                if (item.storage_path) {
                  if (getPublicUrl && typeof getPublicUrl === "function") {
                    try {
                      const url = await getPublicUrl(item.storage_path)
                      if (url) {
                        return {
                          id: item.id || `${type}-${idx}-${Math.random().toString(36).slice(2, 8)}`,
                          type,
                          src: url,
                          filename: item.filename,
                        }
                      }
                      console.warn("getPublicUrl returned empty for object storage_path:", item.storage_path)
                      return null
                    } catch (err) {
                      console.warn("Error getting public url for object.storage_path:", item.storage_path, err)
                      return null
                    }
                  } else {
                    console.warn("getPublicUrl no disponible; objeto ignorado:", item)
                    return null
                  }
                }
              }

              return null
            })
          )

          // Filtrar nulos y añadir al resultado final
          resolvedForType.forEach((r) => {
            if (r && r.src) results.push(r)
          })
        }

        // Ordenación por tipo para "All" (mantener Wedding, Portrait, NewbornAndFamily)
        const orderMap = { Wedding: 1, Portrait: 2, NewbornAndFamily: 3 }
        results.sort((a, b) => (orderMap[a.type] || 99) - (orderMap[b.type] || 99))

        if (!mounted) return
        setPortfolioImages(results)
        setIsLoading(false)
      } catch (err) {
        console.error("Error resolviendo galleryPhotos a portfolioImages:", err)
        if (!mounted) return
        setPortfolioImages([])
        setIsLoading(false)
      }
    }

    // Si el context aún está cargando, esperaremos
    if (dataLoading) {
      setIsLoading(true)
    }

    // Ejecutar resolución (no bloquear si dataLoading true; el effect volverá a dispararse)
    resolveAll()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galleryPhotos, dataLoading, getPublicUrl])

  // ----- Responsive: resize listener -----
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)
      // mostrar sidebar solo en desktop
      setIsAsideVisible(window.innerWidth >= 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // ----- Lógica de selección y columnas (masonry) -----
  const filteredImages = selectedCategory === "All" ? portfolioImages : portfolioImages.filter((img) => img.type === selectedCategory)

  const getColumns = (items, numCols) => {
    const columns = Array.from({ length: numCols }, () => [])
    // simple balancing (puedes mejorar con alturas reales si lo necesitas)
    const columnHeights = Array(numCols).fill(0)
    const estimatedHeight = 300
    items.forEach((item) => {
      const idx = columnHeights.indexOf(Math.min(...columnHeights))
      columns[idx].push(item)
      columnHeights[idx] += estimatedHeight
    })
    return columns
  }

  const numColumns = isMobile ? 2 : 3
  const columns = numColumns === 1 ? [filteredImages] : getColumns(filteredImages, numColumns)

  // Simulación de carga local para transiciones (mantengo tu UX)
  useEffect(() => {
    // Si el context está cargando, mantener loader
    if (dataLoading) {
      setIsLoading(true)
      return
    }
    // Si las imágenes dinámicas aún se están resolviendo, isLoading será true
    const timer = setTimeout(() => {
      // solo quitar loading si ya resolvimos portfolioImages
      setIsLoading(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [dataLoading, portfolioImages.length])

  // ----- Sidebar / filtros -----
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    setIsLoading(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => setIsLoading(false), 250)
    if (isMobile) setIsAsideVisible(false)
  }

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation()
    setIsAsideVisible((prev) => !prev)
  }

  // ----- Lightbox -----
  const openLightbox = (image) => {
    setLightboxImage(image)
    document.body.style.overflow = "hidden"
  }
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

          {/* Sidebar con categorías */}
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
            {/* Mobile selector */}
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

            {isLoading ? (
              <div className="gallery-loading">
                <div className="loading-spinner" />
                <p>Loading gallery...</p>
              </div>
            ) : (
              <motion.div className="gallery-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {columns.map((column, colIndex) => (
                  <div key={`column-${colIndex}`} className="gallery-column">
                    {column.map((image, imgIndex) => (
                      <motion.div
                        key={image.id || `${image.type}-${imgIndex}`}
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
                          <img src={image.src || "/placeholder.svg"} alt={`${image.type} photography by Diego Aloma`} loading="lazy" />
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
              <img src={lightboxImage.src || "/placeholder.svg"} alt={`${lightboxImage.type} photography by Diego Aloma`} className="lightbox-image" />
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
