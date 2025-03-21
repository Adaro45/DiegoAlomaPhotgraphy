"use client"

import { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./Routes/Router"
import Header from "./Layout/Components/Header"
import LoadingScreen from "./Layout/Components/LoadingScreen"
import "./App.css"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <main className="main-content">
            <Router />
          </main>
        </>
      )}
    </BrowserRouter>
  )
}

export default App

