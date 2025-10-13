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
    // Compatibilidad: preferir NEXT_PUBLIC_ (Next.js), fall back a REACT_APP_ (CRA)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseInstance
}

export const PublicDataProvider = ({ children }) => {
  const [slideshows, setSlideshows] = useState({})
  const [galleryPhotos, setGalleryPhotos] = useState({
    Wedding: [],
    Portrait: [],
    NewbornAndFamily: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagesPreloaded, setImagesPreloaded] = useState(false)

  const supabase = getSupabaseClient()
  const DEFAULT_BUCKET = "photographer-images" // cambia si tu bucket se llama distinto

  // Obtener URL pública (intenta publicUrl y si no existe, crea signed url temporal)
  const getPublicUrl = useCallback(
    async (path, bucket = DEFAULT_BUCKET) => {
      if (!supabase || !path) return ""
      try {
        // getPublicUrl es síncrono en supabase-js; devuelve data.publicUrl si el bucket es público
        const { data: publicData, error: publicError } = supabase.storage.from(bucket).getPublicUrl(path)
        if (publicError) {
          // no rompemos aquí, intentamos fallback a signed url
          console.warn("getPublicUrl returned error (will try signed url):", publicError.message || publicError)
        }
        const publicUrl = publicData?.publicUrl
        if (publicUrl) return publicUrl

        // Fallback: crear signed url temporal (60s)
        const { data: signedData, error: signedError } = await supabase.storage.from(bucket).createSignedUrl(path, 60)
        if (signedError) {
          console.error("Error creando signed URL:", signedError)
          return ""
        }
        return signedData?.signedUrl || ""
      } catch (err) {
        console.error("Error en getPublicUrl:", err)
        return ""
      }
    },
    [supabase]
  )

  // Cargar un slideshow específico por slug
  const loadSlideshowBySlug = useCallback(
    async (slug) => {
      if (!supabase) return { images: [], error: "Supabase no inicializado" }

      try {
        const { data: slideshow, error: slideshowError } = await supabase
          .from("slideshows")
          .select("id, name, slug")
          .eq("slug", slug)
          .single()
        if (slideshowError) throw slideshowError

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

        // photos puede ser array de registros; mapear y resolver URLs asincrónicamente
        const imagePromises = photos.map(async (sp) => {
          const storagePath = sp?.photos?.storage_path || sp?.storage_path || null
          return await getPublicUrl(storagePath)
        })

        const images = (await Promise.all(imagePromises)).filter(Boolean)
        return { images, error: null }
      } catch (error) {
        console.error(`Error cargando slideshow ${slug}:`, error)
        return { images: [], error: error.message || String(error) }
      }
    },
    [supabase, getPublicUrl]
  )

  // Cargar fotos de la galería principal organizadas por tipo
  const loadGalleryPhotos = useCallback(async () => {
    if (!supabase) return { photos: {}, error: "Supabase no inicializado" }

    try {
      const { data: photos, error } = await supabase
        .from("photos")
        .select("id, storage_path, filename, type, order_index")
        .eq("in_gallery", true)
        .order("order_index")

      if (error) throw error


      const photosByType = {
        Wedding: [],
        Portrait: [],
        NewbornAndFamily: []
      }

      // Mapear y resolver URLs en paralelo
      const photosWithUrls = await Promise.all(
        (photos || []).map(async (photo) => {
          const url = await getPublicUrl(photo.storage_path)
          return { ...photo, url }
        })
      )

      photosWithUrls.forEach((p) => {
        if (!p.url) return
        // Asegurarse que la propiedad type exista y sea una de las esperadas
        if (p.type && Object.prototype.hasOwnProperty.call(photosByType, p.type)) {
          photosByType[p.type].push(p.url)
        } else {
          // Si hay tipos inesperados, puedes decidir push en un bucket 'other' o ignorar
          console.warn("Tipo de foto inesperado (ignored):", p.type)
        }
      })

      return { photos: photosByType, error: null }
    } catch (error) {
      console.error("Error cargando fotos de galería:", error)
      return { photos: {}, error: error.message || String(error) }
    }
  }, [supabase, getPublicUrl])

  // Pre-cargar imágenes críticas (mantengo tu implementación)
  const preloadImages = useCallback(async (imageUrls, maxImages = 5) => {
    const imagesToPreload = (imageUrls || []).slice(0, maxImages)

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
      return true
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
      const [
        homePageResult,
        weddingAboutMeResult,
        portraitAboutMeResult,
        newbornAboutMeResult,
        galleryResult
      ] = await Promise.all([
        loadSlideshowBySlug("home-page"),
        loadSlideshowBySlug("wedding-about-me"),
        loadSlideshowBySlug("portrait-about-me"),
        loadSlideshowBySlug("newborn-about-me"),
        loadGalleryPhotos()
      ])

      const slideshowsData = {
        "home-page": homePageResult.images || [],
        "wedding-about-me": weddingAboutMeResult.images || [],
        "portrait-about-me": portraitAboutMeResult.images || [],
        "newborn-about-me": newbornAboutMeResult.images || []
      }

      setSlideshows(slideshowsData)
      setGalleryPhotos(galleryResult.photos || { Wedding: [], Portrait: [], NewbornAndFamily: [] })

      if (homePageResult.images?.length > 0) {
        await preloadImages(homePageResult.images, 5)
      }

      setImagesPreloaded(true)
    } catch (error) {
      console.error("Error cargando datos iniciales:", error)
      setError(error.message || String(error))
      setImagesPreloaded(true)
    } finally {
      setLoading(false)
    }
  }, [supabase, loadSlideshowBySlug, loadGalleryPhotos, preloadImages])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  const value = {
    slideshows,
    galleryPhotos,
    loading,
    error,
    imagesPreloaded,
    getPublicUrl,
    loadSlideshowBySlug,
    loadGalleryPhotos,
    refreshData: loadInitialData
  }

  return <PublicDataContext.Provider value={value}>{children}</PublicDataContext.Provider>
}

export default PublicDataProvider
