import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Al cambiar de ruta, se hace scroll al tope
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default ScrollToTop;
