// Theme configuration for consistent styling across the site
const theme = {
    colors: {
      primary: "#2DA8D6",
      secondary: "#FFC107",
      dark: "#212529",
      light: "#F7F7F7",
      white: "#FFFFFF",
      gray: "#6C757D",
      lightGray: "#DEE2E6",
      darkGray: "#495057",
      overlay: "rgba(33, 37, 41, 0.7)",
      transparentLight: "rgba(255, 255, 255, 0.8)",
    },
    fonts: {
      heading: "'SF Pro Display', sans-serif",
      body: "'Roboto', sans-serif",
      accent: "'Sinera', serif",
    },
    shadows: {
      small: "0 2px 8px rgba(0, 0, 0, 0.1)",
      medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
      large: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    transitions: {
      fast: "0.2s ease",
      medium: "0.3s ease",
      slow: "0.5s ease",
    },
    borderRadius: {
      small: "4px",
      medium: "8px",
      large: "16px",
      round: "50%",
    },
    breakpoints: {
      mobile: "480px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1200px",
    },
    container: {
      padding: {
        mobile: "1rem",
        tablet: "2rem",
        desktop: "3rem",
      },
      maxWidth: "1400px",
    },
  }
  
  export default theme
  
  