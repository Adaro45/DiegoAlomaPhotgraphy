"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const PublicDataContext = createContext()

export const usePublicData = () => {
  const context = useContext(PublicDataContext)
  if (!context) {
    throw new Error("usePublicData debe usarse dentro de PublicDataProvider")
  }
  return context
}

let supabaseInstance = null

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    // Para Create React App usa process.env
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Faltan variables de entorno de Supabase")
      console.error("REACT_APP_SUPABASE_URL:", supabaseUrl ? "✓" : "✗")
      console.error("REACT_APP_SUPABASE_ANON_KEY:", supabaseKey ? "✓" : "✗")
      return null
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey)
    console.log("✅ Supabase inicializado correctamente")
  }
  return supabaseInstance
}

export const PublicDataProvider = ({ children }) => {
  const [slideshows, setSlideshows] = useState({})
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagesPreloaded, setImagesPreloaded] = useState(false)

  const supabase = getSupabaseClient()

  // Función para obtener URL pública de una imagen
  const getPublicUrl = useCallback(
    (path, bucket = "photographer-images") => {
      if (!supabase || !path) return ""
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path)
      return publicUrl
    },
    [supabase]
  )

  // Cargar un slideshow específico por slug
  const loadSlideshowBySlug = useCallback(
    async (slug) => {
      if (!supabase) return { images: [], error: "Supabase no inicializado" }

      try {
        // Obtener slideshow por slug
        const { data: slideshow, error: slideshowError } = await supabase
          .from("slideshows")
          .select("id, name, slug")
          .eq("slug", slug)
          .single()

        if (slideshowError) throw slideshowError

        // Obtener fotos del slideshow
        const { data: photos, error: photosError } = await supabase
          .from("slideshow_photos")
          .select(
            `
            order_index,
            photos (
              id,
              storage_path,
              filename,
              type
            )
          `
          )
          .eq("slideshow_id", slideshow.id)
          .order("order_index")

        if (photosError) throw photosError

        // Formatear las fotos para devolver solo URLs
        const images = photos.map((sp) => getPublicUrl(sp.photos.storage_path))

        return { images, error: null }
      } catch (error) {
        console.error(`Error cargando slideshow ${slug}:`, error)
        return { images: [], error: error.message }
      }
    },
    [supabase, getPublicUrl]
  )

  // Cargar fotos de la galería principal
  const loadGalleryPhotos = useCallback(async () => {
    if (!supabase) return { images: [], error: "Supabase no inicializado" }

    try {
      const { data: photos, error } = await supabase
        .from("photos")
        .select("id, storage_path, filename, type, order_index")
        .eq("in_gallery", true)
        .order("order_index")

      if (error) throw error

      // Formatear las fotos para devolver solo URLs
      const images = photos.map((photo) => getPublicUrl(photo.storage_path))

      return { images, error: null }
    } catch (error) {
      console.error("Error cargando fotos de galería:", error)
      return { images: [], error: error.message }
    }
  }, [supabase, getPublicUrl])

  // Pre-cargar imágenes críticas
  const preloadImages = useCallback(async (imageUrls, maxImages = 5) => {
    const imagesToPreload = imageUrls.slice(0, maxImages)
    
    const preloadPromises = imagesToPreload.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => reject(url)
        img.src = url
      })
    })

    try {
      await Promise.allSettled(preloadPromises)
      return true
    } catch (error) {
      console.warn("Algunas imágenes no se pudieron pre-cargar:", error)
      return true // Continuar aunque algunas fallen
    }
  }, [])

  // Cargar todos los datos iniciales necesarios para la página
  const loadInitialData = useCallback(async () => {
    if (!supabase) {
      setError("Supabase no está configurado correctamente. Verifica tus variables de entorno.")
      setLoading(false)
      setImagesPreloaded(true)
      return
    }
  
    setLoading(true)
    setError(null)
  
    try {
      // Cargar TODOS los slideshows en paralelo
      const [
        homePageResult,
        weddingsHomePageResult,
        weddingAboutMeResult,
        portraitAboutMeResult,
        newbornAboutMeResult,
        galleryResult
      ] = await Promise.all([
        loadSlideshowBySlug("home-page"),
        loadSlideshowBySlug("weddings-home-page"),
        loadSlideshowBySlug("wedding-about-me"),
        loadSlideshowBySlug("portrait-about-me"),
        loadSlideshowBySlug("newborn-about-me"),
        loadGalleryPhotos(),
      ])
  
      // Guardar los slideshows organizados por slug
      const slideshowsData = {
        "home-page": homePageResult.images,
        "weddings-home-page": weddingsHomePageResult.images,
        "wedding-about-me": weddingAboutMeResult.images,
        "portrait-about-me": portraitAboutMeResult.images,
        "newborn-about-me": newbornAboutMeResult.images,
      }
  
      setSlideshows(slideshowsData)
      setGalleryPhotos(galleryResult.images)
  
      // Pre-cargar las primeras 5 imágenes del home-page
      if (homePageResult.images.length > 0) {
        await preloadImages(homePageResult.images, 5)
      }
  
      setImagesPreloaded(true)
    } catch (error) {
      console.error("Error cargando datos iniciales:", error)
      setError(error.message)
      setImagesPreloaded(true)
    } finally {
      setLoading(false)
    }
  }, [supabase, loadSlideshowBySlug, loadGalleryPhotos, preloadImages])

  // Cargar datos al montar el componente
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const value = {
    // Datos
    slideshows, // { "home-page": [...urls], "weddings-home-page": [...urls] }
    galleryPhotos, // [...urls]
    
    // Estados
    loading,
    error,
    imagesPreloaded,
    
    // Funciones
    getPublicUrl,
    loadSlideshowBySlug,
    loadGalleryPhotos,
    refreshData: loadInitialData,
  }

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>
}

export default PublicDataProvider