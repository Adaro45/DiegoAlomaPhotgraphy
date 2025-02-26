import React, { useState, useEffect, useRef } from "react";
import "./styles/Portfolio.css";
import { portfolioImages } from "../../globalimages";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa6";

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // En desktop se muestra el selector (aside) por defecto; en mobile se oculta
  const [isAsideVisible, setIsAsideVisible] = useState(!isMobile);
  const asideRef = useRef(null);
  const buttonRef = useRef(null);

  const categories = ["All", "Wedding", "Portrait","NewbornAndFamily"];

  // Filtrado según la categoría seleccionada
  const filteredImages =
    selectedCategory === "All"
      ? portfolioImages
      : portfolioImages.filter((image) => image.type === selectedCategory);

  // Si se selecciona "All" se ordenan primero las Wedding, luego Portrait y el resto
  const sortedImages =
    selectedCategory === "All"
      ? [...filteredImages].sort((a, b) => {
          const order = { Wedding: 1, Portrait: 2 };
          const aOrder = order[a.type] || 3;
          const bOrder = order[b.type] || 3;
          return aOrder - bOrder;
        })
      : filteredImages;

  // Distribuir en columnas para desktop (masonry)
  const getColumns = (items, numCols) => {
    const columns = Array.from({ length: numCols }, () => []);
    for (let i = 0; i < items.length; i++) {
      columns[i % numCols].push(items[i]);
    }
    return columns;
  };

  const numColumns = isMobile ? 2 : 3;
  const columns =
    numColumns === 1 ? sortedImages : getColumns(sortedImages, numColumns);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      // En mobile ocultamos el selector; en desktop se muestra por defecto
      setIsAsideVisible(!newIsMobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // En desktop, si se hace click fuera del aside y botón, se oculta el selector
  useEffect(() => {
    if (!isMobile && isAsideVisible) {
      const handleClickOutside = (e) => {
        if (
          !asideRef.current?.contains(e.target) &&
          !buttonRef.current?.contains(e.target)
        ) {
          setIsAsideVisible(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isAsideVisible, isMobile]);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`portfolio-layout ${
        isAsideVisible ? "portfolio-aside-visible" : ""
      }`}
    >
      {/* Botón para togglear el selector en desktop */}
      {!isMobile && (
        <button
          ref={buttonRef}
          className="portfolio-toggle-aside-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsAsideVisible(!isAsideVisible);
          }}
        >
          {isAsideVisible ? <FaCaretLeft /> : <FaCaretRight />}
        </button>
      )}

      {/* Aside con los filtros (solo en desktop) */}
      {!isMobile && (
        <aside
          ref={asideRef}
          className={`portfolio-filter-section ${
            isAsideVisible ? "visible" : ""
          }`}
        >
          <h2>Categories</h2>
          <ul className="portfolio-category-list">
  {categories.map((category) => (
    <li
      key={category}
      className={`portfolio-category-item ${selectedCategory === category ? "active" : ""}`}
      onClick={() => handleCategoryChange(category)}
    >
      {category === "NewbornAndFamily" ? "Newborns" : category}
    </li>
  ))}
</ul>

        </aside>
      )}

      {/* Sección de galería */}
      <main className="portfolio-gallery-section">
        {/* En móvil se muestra un selector personalizado sticky */}
        {isMobile && (
          <div className="portfolio-mobile-category-selector-container">
            <div className="portfolio-mobile-category-selector">
  {categories.map((category) => (
    <span
      key={category}
      className={`portfolio-mobile-category-item ${selectedCategory === category ? "active" : ""}`}
      onClick={() => handleCategoryChange(category)}
    >
      {category === "NewbornAndFamily" ? "Newborns" : category}
    </span>
  ))}
</div>

          </div>
        )}

<div className="portfolio-gallery-grid">
  {columns.map((col, colIndex) => (
    <div key={colIndex} className="portfolio-gallery-column">
      {col.map((item) => (
        <div key={item.id} className="portfolio-gallery-item">
          <img src={item.src} alt={`${item.id}`} />
        </div>
      ))}
    </div>
  ))}
</div>

      </main>
    </div>
  );
};

export default Portfolio;
