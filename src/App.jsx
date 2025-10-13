"use client"

import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./Routes/Router"
import Header from "./Layout/Components/Header"
import LoadingScreen from "./Layout/Components/LoadingScreen"
import { PublicDataProvider, usePublicData } from "./context/PublicDataContext"
import "./App.css"

// Componente interno que usa el contexto
function AppContent() {
  const { loading: dataLoading, imagesPreloaded } = usePublicData()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Esperar a que los datos estén listos Y las imágenes pre-cargadas
    if (!dataLoading && imagesPreloaded) {
      // Pequeño delay para mejor UX
      const timer = setTimeout(() => {
        setShowLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [dataLoading, imagesPreloaded])

  return (
    <>
      {showLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <main className="main-content">
            <Router />
          </main>
        </>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PublicDataProvider>
        <AppContent />
      </PublicDataProvider>
    </BrowserRouter>
  )
}

export default App