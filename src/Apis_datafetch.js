// export const apiMercadoLibre = async (tipo_de_articulo) => {
//     const url = 'https://api.mercadolibre.com/sites/MLM/search?q=${tipo_de_articulo}';
//     const response = await fetch(url);
//     const data = await response.json();
//     return data;
//   }
//   const API_KEY_Unsplash = 'f5BSkGSTzmN5JwHDxnjURPvgY_z_vRZWH4Ez9ElaHRc';

//   export const apiUnsplashEspecific = async () => {
//     try {
//       const response = await fetch(`https://api.unsplash.com/photos/EI4HOz6a3C4?client_id=${API_KEY_Unsplash}`);
//       const data = await response.json();
//       return data.urls.full; // Devuelve directamente la URL de la imagen
//     } catch (error) {
//       console.log(error);
//       return null; // Devuelve null en caso de error
//     }
//   };
  import axios from "axios";

  const API_URL = "http://localhost:8000/api/images/"; // Ajusta la URL según tu configuración
  
  // Obtener todas las imágenes
  export const getImages = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las imágenes:", error);
      throw error;
    }
  };
  
  // Agregar una nueva imagen
  export const createImage = async (imageData) => {
    try {
      const response = await axios.post(API_URL, imageData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear la imagen:", error);
      throw error;
    }
  };
  
  // Eliminar una imagen por su ID
  export const deleteImage = async (imageId) => {
    try {
      await axios.delete(`${API_URL}${imageId}/`);
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      throw error;
    }
  };
  
  
  