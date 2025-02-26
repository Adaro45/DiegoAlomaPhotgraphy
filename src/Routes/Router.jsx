import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../Layout/Components/ScrollToTop';

// Importa las páginas de forma lazy
const Home = lazy(() => import('../Layout/Pages/Home'));
const AboutMe = lazy(() => import('../Layout/Pages/AboutMe'));
const Portfolio = lazy(() => import('../Layout/Pages/Portfolio'));
const ContactPage = lazy(()=> import('../Layout/Pages/Contact'))

const AppRouter = () => {
  return (
    <ScrollToTop>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<ContactPage/>}></Route>
        </Routes>
      </Suspense>
    </ScrollToTop>
  );
};

export default AppRouter;
